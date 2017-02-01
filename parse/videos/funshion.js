
var type = 'funshion';
var format = require('format');

var Funshion = {
	 getVideoInformation:function(url,customHandler){
		var http = require('http');
		var type = 'funshion';
		var data = '';
		var handler = require('../handlers/FunshionHandler');

		var playInfoRequestUrl = 'http://api.funshion.com/ajax/get_webplayinfo/%s/%s/mp4';
		var realPathRequestUrl = 'http://jobsfe.funshion.com/query/v1/mp4/%s.json?bits=%s';

		var url_reg = /http:\/\/www.funshion.com.+?(\d+)\/(\d+)/g;
		var result;
		if(result = url_reg.exec(url)){
			var param1 = result[1];
			var param2 = result[2];
			var playInfoUrl = format(playInfoRequestUrl,param1,param2);
			console.log(playInfoUrl);
			var data = '';
			http.get(playInfoUrl,function(response){
				response.on('data',function(chunk){
					data += chunk;
				});
				var resultArray = new Array();
				response.on('end',function(){
					var infoJson = JSON.parse(data);
					console.log(infoJson);
					if(infoJson.playinfos.length == 0){
						customHandler(handler.firstFail(url,'无法获取真实地址，目前风行只支持动漫，电影，电视剧',200));
					}else{
						for(var info in infoJson.playinfos){
							var clarity = '';
							switch(infoJson.playinfos[info].clarity){
								case 'high-dvd':
									clarity = 'hd2';
									break;
								case 'dvd':
									clarity = 'mp4';
									break;
								case 'tv':
									clarity = 'flv';
									break;
							}
							var obj = {
								'type':clarity,
								'request_url':format(realPathRequestUrl,infoJson.playinfos[info].cid,infoJson.playinfos[info].byterate),
							}
							resultArray.push(obj);
						}
						customHandler(handler.firstSuccess(url,resultArray));
					}
				});
			});
		}else{
			customHandler(handler.firstFail(url,'无法获取源代码',200));
		}
	},
	/*通过用户在本地获取的JSON数据，提取下载地址*/
	getDownloadInformation:function(data,customHandler){
		console.log(data);
		var handler = require('../handlers/FunshionHandler');
		if(data.playlist){
			customHandler(handler.secondSuccess(data.playlist[0].urls));
		}else{
			customHandler(handler.secondFail(200,'无法获取到正确的地址'))
		}
	}
}

module.exports = Funshion;

