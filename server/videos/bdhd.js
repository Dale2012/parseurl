var requestUrl = 'http://radar.video.baidu.com/vsniffer?url=%s';
var error = require('./error');
var handler = require('../handlers/BDHDHandler');
var BDHD = {
	get:function(url,customHandler){
		var needle = require('needle');
		var format = require('format');
		var target =  format(requestUrl,url);
		console.log(target);
		needle.get(target,function(err,res,body){
			if(err || res.statusCode != 200){
				customHandler(handler.fail(url=url,code=error.errorCode.msg_can_not_get_keyword,msg=error.errorMsg.msg_can_not_get_keyword));
			}else{			
				var jsonData = JSON.parse(body);
				if(jsonData.play_urls){
					customHandler(handler.success(url=url,urls=jsonData.play_urls));
				}else{
					customHandler(handler.fail(url=url,code=error.errorCode.msg_can_not_get_keyword,msg=error.errorMsg.msg_can_not_get_keyword));
				}
			}
		});
	},
}

module.exports = BDHD;