require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const api = require('./api');
const mongoose = require('mongoose');
const session = require('koa-session');
const ssr = require('./ssr');
const path = require('path');
const serve = require('koa-static');

const staticPath = path.join(__dirname, '../../BIBS/build'); // path 변경필요

const {
    PORT: port = 4000, // 값이 존재하지 않는다면 4000을 기본 값으로 사용
    MONGO_URI: mongoURI,
    COOKIE_SIGN_KEY: signKey
} = process.env;

mongoose.Promise = global.Promise; // Node의 Promise로 사용하도록 설정
mongoose.connect(mongoURI,{useNewUrlParser: true}).then(() => {
    console.log('connected to mongodb');
}).catch((e) => {
    console.error(e);
});

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용
router.get('/', ssr);

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// 세션/키 적용
const sessionConfig = {
    maxAge: 86400000. // 하루
    // signed: true(기본으로 설정)
};

app.use(session(sessionConfig, app));
app.key = [signKey];

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.use(serve(staticPath)); // 주의: serve가 ssr전에 와야만 한다.
app.use(ssr); // 일치하는 것이 없으면 ssr을 실행

app.listen(port, () => {
    console.log('listening to port', port);
});