
var type = 'funshion';
var error = require('./error');
var handler = require('../handlers/FunshionHandler');
var Funshion = {
	 getVideoInformation:function(url,customHandler){
		var http = require('http');
		var type = 'funshion';
		var data = '';
		var format = require('format');
		var needle = require('needle');
		var playInfoRequestUrl = 'http://api.funshion.com/ajax/get_webplayinfo/%s/%s/mp4';
		var realPathRequestUrl = 'http://jobsfe.funshion.com/query/v1/mp4/%s.json?bits=%s';
		var url_reg = /http:\/\/www.funshion.com.+?(\d+)\/(\d+)/g;
		var result;
		if(result = url_reg.exec(url)){
			var param1 = result[1];
			var param2 = result[2];
			var playInfoUrl = format(playInfoRequestUrl,param1,param2);
			console.log(playInfoUrl);

			needle.get(playInfoUrl,function(eror,resp,body){
				var infoJson = JSON.parse(body);
				var resultArray = [];
				for(var info in infoJson.playinfos){
					var cur = infoJson.playinfos[info];
					var clarity;
					switch(cur.clarity){
						case 'high-dvd':
							clarity = 'hd2';
							break;
						case  'dvd':
							clarity = 'mp4';
							break;
						case 'tv':
							clarity = 'flv';
							break;
						default:
							clarity = '3gp';
							break;
					}
					var obj = {
						'type':clarity,
						'request_url':format(realPathRequestUrl,cur.cid,cur.byterate)
					}
					resultArray.push(obj);
				}
				customHandler(handler.firstSuccess(url,resultArray));
			});
		}else{
			customHandler(handler.firstFail(url=url,code=error.errorCode.msg_can_not_get_keyword,msg=error.errorMsg.msg_can_not_get_keyword));
		}
	},
	/*通过用户在本地获取的JSON数据，提取下载地址*/
	getDownloadInformation:function(data,customHandler){
		try{
			// var json = JSON.parse(data);
			customHandler(handler.secondSuccess(data.playlist[0].urls));
		}catch(err){
			customHandler(handler.secondFail(code=error.errorCode.msg_json_package_error,msg=error.errorMsg.msg_json_package_error));
		}		
	}
}

module.exports = Funshion;

// Funshion.getVideoInformation('http://www.funshion.com/subject/play/106981/1',function(result){
// 	console.log('结果:'+JSON.stringify(result,null,4));
// });

// Funshion.getDownloadInformation('{"return":"succ","client":{"ip":"180.161.142.117","sp":"0","loc":"0"},"playlist":[{"bits":"327680","tname":"tv","size":"212515717","urls":["http://222.73.131.138:80/play/86C2058FFC000E1CA7FA8E60DB467C6921505C6F.mp4","http://61.155.217.3:80/play/86C2058FFC000E1CA7FA8E60DB467C6921505C6F.mp4","http://58.215.93.73:80/play/86C2058FFC000E1CA7FA8E60DB467C6921505C6F.mp4","http://115.238.189.14:80/play/86C2058FFC000E1CA7FA8E60DB467C6921505C6F.mp4"]}]}',function(result){
// 	console.log('结果:'+JSON.stringify(result,null,4));	
// });
