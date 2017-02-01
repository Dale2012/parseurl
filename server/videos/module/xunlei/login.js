var needle 	= require('needle');
var crypto 	= require('crypto');
var format 	= require('format');
var verfiCodeRequestUrl = 	'http://login.xunlei.com/check?u=%s&cachetime=%s';
var loginUrl 			= 	'http://login.xunlei.com/sec2login';
var _postData 			=	'u=%s&p=%s&verifycode=%s&login_enable=1&login_hour=720';
var _ua 				=	'Mozilla/5.0 (iPad; U; CPU OS 5_1_1 like Mac OS X; en-us) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

function getVerifyCode(username,callback){
	var toReq = format(verfiCodeRequestUrl,username,new Date().getTime());
	var opts = {
		headers:{
			'User-Agent':_ua,
			'Host':'vod.xunlei.com',
			'Referer':'http://vod.xunlei.com/home.html',
		}
	}
	needle.get(toReq,opts,function(err,resp,body){

		var check_result_key  = resp.headers['set-cookie'][0],
			check_result_code = resp.headers['set-cookie'][1];
		var reg_code = /check_result=0:(.+?);/gi,
			reg_key = /VERIFY_KEY=(.+?);/gi

		var verifycode = reg_code.exec(check_result_code),
			verifykey  = reg_key.exec(check_result_key);
		if(verifycode){
			callback(verifycode[1],verifykey[1]);
		}else{
			callback(false);
		}
	});
}

var XunleiLogin = {
	getNewSessionID:function(username,password,customHandler){
		getVerifyCode(username,function(verifycode,verifykey){
			console.log('verifycode:'+ verifycode + " verifykey:"+verifykey);
			if(verifycode === false){

			}else{
				var opts = {
					headers:{
						'Cookie':'VERIFY_KEY='+verifykey + '; check_result=0:' + verifycode,
						'Host':'login.xunlei.com',
						'Referer':'http://vod.xunlei.com/home.html',
						'User-Agent':_ua
					}
				}
				
				var first = crypto.createHash('md5').update(password).digest('hex');
				var second = crypto.createHash('md5').update(first).digest('hex');
				var third = crypto.createHash('md5').update(second+verifycode.toUpperCase()).digest('hex');

				var data = format(_postData,username,third,verifycode);
				var success = false;
				needle.post(url = loginUrl,data=data,options=opts,callback=function(err, response, body){
					if(!err && response.statusCode == 200){
						var re = eval(response.headers)
						for(var i in re['set-cookie']){
							if(re['set-cookie'][i].indexOf('sessionid') == 0){
								var reg =  /sessionid=(.+?);/gim;
								var r = reg.exec(re['set-cookie'][i]);
								success = true;
								customHandler(r[1]);
								break;
							}
						}
						if(success == false){
							customHandler(false);
						}
					}
				});
			}
		});
	}
}

module.exports = XunleiLogin;

