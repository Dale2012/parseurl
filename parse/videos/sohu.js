
var type='sohu';
var url_not_right_code = '30001',
	can_not_get_keyword_code = '3001',
	can_not_get_source_code  = '3002',
	sohu_service_not_started = '3003';

var msg_url_not_right = 'url地址不正确',
	msg_can_not_get_source = '无法获取源代码',
	msg_can_not_get_keyword = '无法获取关键字',
	msg_sohu_not_started = '搜狐服务未启动';


	
var Sohu = {
	get:function(url,handler,id,episode,customHandler){
		var validator = /http:\/\/(tv.sohu.com)(.+?html)/g;
		
		if(validator.test(url)){
			var http = require('http');
			var options = {
				port:9999,
				path:'/?url='+url+"&episode="+episode+"&id="+id,
			};
			var data = '';
			var request = http.get(options,function(response){
				response.on('data',function(chunk){
					data += chunk;
				});
				response.on('end',function(){
					console.log(data);
					var result = JSON.parse(data);
					customHandler(handler.success(type=type,url=url,id=id,episode=episode,down_urls=result.down_urls));
				});				
			});
			request.on('error',function(){
					console.error('sohu service not started');
					customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=sohu_service_not_started,msg=msg_sohu_not_started));
			});
		}else{
			customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=url_not_right_code,msg=msg_url_not_right));
		}
	}
};

module.exports = Sohu;