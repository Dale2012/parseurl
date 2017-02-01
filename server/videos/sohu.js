var type='sohu';
var error  = require('./error');
var sys = require('sys');
var exec = require('child_process').exec;

var Sohu = {
	get:function(url,handler,id,episode,customHandler){
		var validator = /http:\/\/(tv.sohu.com)(.+?html)/g;
		if(validator.test(url)){
			id = typeof(id) == 'undefined'?'':id;
			episode = typeof(episode) == 'undefined'?'':episode;

			var command = "casperjs videos/sohu_casper.js " + url + " " + id + " " + episode;
			console.log(command);
			child = exec(command,function(err,stdout,stderr){
				if(err != null){
					console.log(err);
					customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_service_not_availiable,msg=error.errorMsg.msg_service_not_availiable));	
				}else{
					console.log(stdout);
					var result = JSON.parse(stdout);
					if(result){
						customHandler(handler.success(type=type,url=url,id=id,episode=episode,down_urls=result.down_urls));
					}else{
						customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_service_not_availiable,msg=error.errorMsg.msg_service_not_availiable));
					}
				}
			});

		}else{
			customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_sohu_not_started,msg=error.errorMsg.msg_sohu_not_started));
		}
	}
};

module.exports = Sohu;