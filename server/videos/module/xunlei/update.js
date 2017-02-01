var fs = require('fs');
var confName 	= 	'./videos/config/xunlei.conf';
var xunlei 		=	require('./login');
function getAUseableSessionID(callbackFn){
	fs.readFile(confName,'utf8',function(err,data){
		if(!err){
			var result 			= 	JSON.parse(data);
			var accounts 		=	result['accounts'];
			var accountsCount	=	accounts.length;
			var	randomChoose 	=	(Math.ceil(Math.random()*1000) % accountsCount);
			var account,counter=0;
			var next = randomChoose;
			do{
				account 	= 	accounts[next];
				counter++;
				next = (next+1 == accountsCount) ? 0 : next++;
			}while(account.expire === true && counter != accountsCount)
			
			if(account.expire === true){
				callbackFn(false);
			}else{
				callbackFn(account.sessionid,account.uid);
			}
		}else{
			callbackFn(false);
		}
	});
}

function updateAnAccount(sessionid){
	fs.readFile(confName,'utf8',function(err,data){
		if(!err){
			var result 	=	JSON.parse(data);
			var accounts = result['accounts'];
			
			for(var i  in accounts){
				if(accounts[i].sessionid === sessionid){
					console.log('开始更新:' + accounts[i].username);
					xunlei.getNewSessionID(accounts[i].username,accounts[i].password,function(sessionID){
						if(sessionID == false){
							console.log('error');
						}else{
							accounts[i]['sessionid'] = sessionID;
							accounts[i]['expire']    = false;
							console.log(accounts);
							fs.writeFile(confName,JSON.stringify(result,null,4),function(err){
								if(!err){
									console.log('更新成功');
								}else{
									console.log('更新失败');
								}
							})
						}
					});
				}
			}
		}else{
			console.log('读取文件出错');
		}
	});
}

function updateAllAccount(){
	fs.readFile(confName,'utf8',function(err,data){
		if(!err){
			var result 	=	JSON.parse(data);
			var accounts = result['accounts'];

			for(var i in accounts){
				if(accounts[i].expire == true){
					xunlei.getNewSessionID(accounts[i].username,accounts[i].password,function(sessionID){
						if(sessionID == "false"){
							console.log('error');
						}else{
							accounts[i]['sessionid'] = sessionID;
							accounts[i]['expire']    = false;
							console.log(accounts);
							fs.writeFile(confName,JSON.stringify(result,null,4),function(err){
								if(!err){
									console.log('更新成功');
								}else{
									console.log('更新失败');
								}
							})
						}
					});
				}
			}
		}
	});
}

function disableAnAccount(sessionid){
	console.log("过期的SessionID:" + sessionid);
	fs.readFile(confName,'utf8',function(err,data){
		if(!err){
			var result = JSON.parse(data);
			var accounts = result['accounts'];
			
			for(var i in accounts){
				if(accounts[i].sessionid === sessionid){
					accounts[i].expire = true;
					console.log('disable username:' + accounts[i].username);
					break;
				}
			}
			console.log(JSON.stringify(result,null,4));
			fs.writeFile(confName,JSON.stringify(result,null,4),function(err){
				if(!err){
					console.log('设置成功');
				}else{
					console.log('设置失败');
				}
			});
		}
	});
}



exports.getAUseableSessionID = getAUseableSessionID;
exports.updateAnAccount = updateAnAccount;
exports.updateAllAccount = updateAllAccount;
exports.disableAnAccount = disableAnAccount;
