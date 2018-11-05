//////////////////////////////////// For BlockChain video server ///////////////////////////////////
var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var crypto = require('crypto');
require('date-utils');

/////////////////////////////////////// For BlockChain Web ///////////////////////////////////////
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "ID",
				"type": "string"
			},
			{
				"name": "_video_hash",
				"type": "string"
			},
			{
				"name": "_time",
				"type": "string"
			},
			{
				"name": "_location",
				"type": "string"
			},
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "addAccidentInfo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "ID",
				"type": "string"
			}
		],
		"name": "newDriversInfo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "ID",
				"type": "string"
			},
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
				"name": "ID",
				"type": "string"
			}
		],
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
	}
];
var ContractAddress = "0x312FC7a4DdC68c402C851842DEA50EA95fFeE169";
var AccCon = web3.eth.contract(abi);
var AccContract = AccCon.at(ContractAddress);

////////////////////////////////// Communicate with raspberry pi //////////////////////////////////
/////////////////////////////////////// transfer video file ///////////////////////////////////////

var upload = multer({
	storage: multer.diskStorage({
		destination : function(req, file, cb){
			cb(null, __dirname);
		},
		filename: function(req, file, cb){
			cb(null, file.originalname);
		}
	}),
});
	
// AccContract.newDriversInfo.sendTransaction('sherry92',{
//                                         to : '0xb68Fe70d8157E5D5fE1cE31B119388cA89dBBb55',
//                                         from : '0x4727cd38A3F959a87f3cF820c4f32Aa00DDc818e',
//                                         gas: 3000000
//                                         }, function(error, transactionHash){
//     if(!error){
//       console.log('no error');
//     }else{
//       console.log(error);
//     }
// });

///////////////////////////////// Transfer Video File from BlackBox ////////////////////////////////
app.use(bodyParser.json());

app.post('/', upload.any(), (req, res)=>{
	console.log(req);
	console.log('Success!');

	var s_time_1 = req.body.video1_start_time;
	var e_time_1 = req.body.video1_end_time;
	var s_time_2 = req.body.video2_start_time;
	var e_time_2 = req.body.video2_end_time;
	var acc_time = req.body.accident_time;

	var e1_s = e_time_1.substring(17,19);
	var acc_s = acc_time.substring(17,19);

	var e1_m = e_time_1.substring(14, 16);
	var acc_m = acc_time.substring(14, 16);

	var sec;
	var front_sec = 30;

	// calculate cutting time
	if(e1_m == acc_m){
		sec = Number(e1_s) - Number(acc_s);
	} else{
		sec = Number(e1_s) + 60 - Number(acc_s);
	}
	
	front_sec = front_sec - sec;

	// cut video file 1
	var execSync = require('child_process').execSync,
		child;

	child = execSync("ffmpeg -i " + req.body.first_file_name + " -acodec copy -vcodec copy -ss " + front_sec.toString() + " -t " + sec.toString() + " " + __dirname + "/accidents/accf.h264 -y", function(error, stdout, stderr){
		console.log('stdout : ' + stdout);
		console.log('stderr : ' + stderr);
		if(error !== null){
			console.log('exec error : ' + error);
		} else {
			console.log('Success!');
		}
	});

	// cut video file 2
	var execSync = require('child_process').execSync,
		child;

	child = execSync("ffmpeg -i " + req.body.second_file_name + " -acodec copy -vcodec copy -ss 0 -t " + front_sec.toString() + " " + __dirname + "/accidents/accb.h264 -y", function(error, stdout, stderr){
		console.log('stdout : ' + stdout);
		console.log('stderr : ' + stderr);
		if(error !== null){
			console.log('exec error : ' + error);
		} else {
			console.log('Success!');
		}
	});

	// cat video file
	var execSync = require('child_process').execSync,
		child;

	child = execSync("ffmpeg -f concat -i " + __dirname + "/accidents/videolist.txt -c copy " + __dirname + "/accidents/" + acc_time + ".h264 -y" , function(error, stdout, stderr){
		console.log('stdout : ' + stdout);
		console.log('stderr : ' + stderr);
		if(error !== null){
			console.log('exec error : ' + error);
		} else {
			console.log('Success!');
		}
	});
	//TODO MAP API and BlockChain TEST NET 
			
	var execSync = require('child_process').execSync,
		child;

	child = execSync("ffmpeg -i " + __dirname + "/accidents/" + acc_time + ".h264 -vcodec h264 -acodec mp2 " + __dirname + "/accidents/" + acc_time + ".mp4 -y" , function(error, stdout, stderr){
		console.log('stdout : ' + stdout);
		console.log('stderr : ' + stderr);
		if(error !== null){
			console.log('exec error : ' + error);
		} else {
			console.log('Success!');
		}
	});

	var file = fs.readFileSync(__dirname + "/accidents/" + acc_time +  ".mp4");
	var sha = crypto.createHash('sha256');
	sha.update(file);
	var output = sha.digest('hex').toString();

	// AccContract.newDriversInfo.sendTransaction('sherry92',{
	//                                         to : '0x66cddb57ad0fac28f33d388af5297b941b9fb2e4',
	//                                         from : web3.eth.accounts[0],
	//                                         gas: 3000000
	//                                         }, function(error, transactionHash){
	//     if(!error){
	//       console.log('no error');
	//     }else{
	//       console.log(error);
	//     }
	//   });
	// AccContract.addAccidentInfo.sendTransaction('sherry92', output, acc_time, 'KAU', 0, {
	// 	                                        to : '0xb68fe70d8157e5d5fe1ce31b119388ca89dbbb55',
	// 	                                        from : '0x4727cd38A3F959a87f3cF820c4f32Aa00DDc818e',
	// 	                                        gas: 6000000
	// 	                                        }, function(error, transactionHash){
	//     if(!error){
	//     	console.log('no error');
	//     }else{
	//     	console.log(error);
	// 	}
	// });
	console.log('FINISH!');
	res.send('Good Job!');
});

app.get('/', function(req, res){
	// var addr = '0x11f25e4870cb62b07917dd52eac32df67b767b06';
	// AccContract.newDriversInfo.sendTransaction('sherry92',{
	//                                         to : '0x66cddb57ad0fac28f33d388af5297b941b9fb2e4',
	//                                         from : web3.eth.accounts[0],
	//                                         gas: 3000000
	//                                         }, function(error, transactionHash){
	//     if(!error){
	//       console.log('no error');
	//     }else{
	//       console.log(error);
	//     }
	//   });

   // AccContract.getAccident('sherry92',3, function(e, r ){
   //   if(e) console.log(e);
   //   else {
   //    console.log(r);
   //  }
   // });

	// var file = fs.readFileSync('f.h264');
	// var sha = crypto.createHash('sha256');

	// sha.update(file);
	// var output = sha.digest('hex').toString();

	// // var output2 = output.substring(0,2);
	// console.log(output);
	// AccContract.addAccidentInfo.sendTransaction('sherry92', buff, '2018-10-25', 'KAU', 2, {
	//                                         to : '0x31f55565c6b8b8cc5b07f2691b38ab6d892da44b',
	//                                         from : web3.eth.accounts[0],
	//                                         gas: 4712388
	//                                         }, function(error, transactionHash){
	//     if(!error){
	//       console.log('no error');
	//     }else{
	//       console.log(error);
	//     }
	//   });
	res.send("Success!");
});

http.listen(8000, function(){
	console.log('server running..');
});
//////////////////////////// Convert between mp4 and base64 text///////////////////////////////

//var buff = new Buffer(file).toString('base64');
// var buff2 = new Buffer(buff, 'base64');

// console.log(buff2);
// console.log(buff2.length);
// fs.writeFileSync('helloworld.mp4', buff2);

////////////////////////////////// Convert h264 to mp4///////////////////////////////////////

// var exec = require('child_process').exec,
// 	child;
// var dt = new Date();
// var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
// var d2 = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
// var d = "16:41:02".split(':');
// var d2 = "16:42:02".split(':');

// var mydate = new DateTime(d[0], d[1], d[2]);
// console.log(mydate.toString());
// console.log(mydate.toFormat('HH24:MI:SS'));
// var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
// console.log(d);

// var dt = new Date();
// var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
// console.log(d);

// child = exec("ffmpeg -i f.h264 -vcodec h264 -acodec mp2 helloworld.mp4 -y", function(error, stdout, stderr){
// 	console.log('stdout : ' + stdout);
// 	console.log('stderr : ' + stderr);
// 	if(error !== null){
// 		console.log('exec error : ' + error);
// 	} else {
// 		// var dt = new Date();
// 		// var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
// 		// console.log(d);
// 		console.log('Success!');
// 	}
// });

// console.log('child? or me?');
