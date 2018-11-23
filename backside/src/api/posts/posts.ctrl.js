// 검증 미들웨어
const { ObjectId } = require('mongoose').Types;

exports.checkObjectId = (ctx, next) => {
    const { id } = ctx.params;

    // 검증 실패
    if(!ObjectId.isValid(id)) {
        ctx.status = 400; // 400 Bad Request
        return null;
    }

    return next(); // next를 리턴해야 ctx.body가 제대로 설정된다.
};

const Post = require('models/post');
const User = require('models/user');
const Joi = require('joi');

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const videoPath = path.join(__dirname, '../../../../public/accidents/');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "getCreator",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getAccident",
        "outputs": [
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_video_hash",
                "type": "string"
            },
            {
                "name": "_time",
                "type": "string"
            },
            {
                "name": "_latitude",
                "type": "string"
            },
            {
                "name": "_longitude",
                "type": "string"
            }
        ],
        "name": "addAccidentInfo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAccidentCount",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
];

const ContractAddress = "0xadb9b5bc7310823e9208ae0e00255036ceb359cb";
const AccCon = web3.eth.contract(abi);
const AccContract = AccCon.at(ContractAddress);
// exports.write = async (ctx) => {
//     // 객체가 지닌 값들을 검증
//     const schema = Joi.object().keys({
//         title: Joi.string().required(), // required는 필수 항목이라는 의미
//         body: Joi.string().required(),
//         tags: Joi.array().items(Joi.string()).required() // 문자열 배열
//     });

//     // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
//     const result = Joi.validate(ctx.request.body, schema);

//     // 오류가 발생하면 오류 내용 응답
//     if(result.error) {
//         ctx.status = 400;
//         ctx.body = result.error;
//         return;
//     }

//     const { title, body, tags } = ctx.request.body;

//     // 새 Post 인스턴스를 만든다.
//     const post = new Post({
//         title, body, tags
//     });

//     try {
//         await post.save(); // 데이터베이스에 등록
//         ctx.body = post; // 저장된 결과를 반환
//     } catch(e) {
//         ctx.throw(e, 500);
//     }
// };

exports.list = async (ctx) => {
    // page가 주어지지 않았다면 1로 간주
    // query는 문자열 형태로 받아 오므로 숫자로 변환
    const page = parseInt(ctx.query.page || 1, 10);
    const { accNum }= ctx.query;
   
    const query = accNum ? {
        accNum: accNum // tags 배열에 tag를 가진 포스트 찾기
    } : {};
    
    // 잘못된 페이지가 주어졌다면 오류
    if(page < 1) {
        ctx.status = 400;
        return;
    }

    try {
        const posts = await Post.find(query)
        .sort({_id: -1})
        .limit(10)
        .skip((page - 1) * 10)
        .exec();
        const postCount = await Post.countDocuments(query).exec();

        const limitBodyLength = post => ({
            ...post,
            // body: post.body.length < 350 ? post.body : `${post.body.slice(0, 350)}...`
            body: post.accNum
        });
        ctx.body = posts.map(limitBodyLength);
        // 마지막 페이지 알려 주기
        // ctx.set은 response header를 설정
        ctx.set('last-page', Math.ceil(postCount / 10));
    } catch(e) {
        ctx.throw(500, e);
    }
};

// 특정 포스트 조회
exports.read = async (ctx) => {
    const { id, userId } = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        const user = await User.findById(userId).exec();

        // 포스트가 없으면
        if(!post) {
            ctx.status = 404;
            return;
        }

        // userId가 다르면 읽을 권한이 없다.
        if(!user) {
            ctx.body = '읽을 권한이 없습니다.'
        } else {
            const file = fs.readFileSync(post.video);
            const sha = crypto.createHash('sha256');
            sha.update(file);
            const output = sha.digest('hex').toString();

            AccContract.getAccident(post.accNum, (e, r) => {
                if(e) console.log(e);
                else{
                    console.log('Hash in Server Data : ' + output);
                    console.log('Hash in Block Data : ' + r[0]);
                    if(output == r[0]){
                        post.video = 'No Change';
                        ctx.body = post;
                    } else {
                        post.video = 'Is Change';
                        ctx.body = post;
                    }
                }
            });
        }
    } catch(e) {
        ctx.throw(e, 500);
    }
};

exports.remove = async (ctx) => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

exports.update = async (ctx) => {
    const { id } = ctx.params;
    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true
            // 이 값을 설정해야 업데이트된 객체를 반환
            // 설정하지 않으면 업데이트되기 전의 객체를 반환
        }).exec();
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

exports.checkLogin = (ctx, next) => {
    if(!ctx.session.logged) {
        ctx.status = 401; // Unauthorized
        return null;
    }
    return next();
};