
var url_not_right_code = '3000',
	can_not_get_keyword_code = '3001',
	can_not_get_source_code  = '3002';

var msg_url_not_right = 'url地址不正确',
	msg_can_not_get_source = '无法获取源代码',
	msg_can_not_get_keyword = '无法获取关键字';


var Letv =	{
	get:function(url,handler,id,episode,customHandler){
		var http = require('http');
		var type = 'letv';
	    var data;

	    var reg = /http:\/\/www.letv.com\/.+?.html/g;
		if(reg.test(url)){
			http.get(url, function(response) {
				response.on('data',function(chunk){
		          data += chunk;
		  		});
			    response.on('end',function(){
		          var reg   = /v:\["(.+?)","(.+?)"\]/g;
		          var input = data;
		          var result1,
		              result2;
		          if(r = reg.exec(input)){
		            result1 = new Buffer(r[1],'base64').toString('ascii');
		            result2 = new Buffer(r[2],'base64').toString('ascii');
		            download_urls = {
		            	'source':'letv',
		            	'urls':[
		            		{
		            			'file':'mp4',
		            			'type':'mp4',
		            			'url':result1
		            		},
		            		{
		            			'file':'mp4',
		            			'type':'hd',
		            			'url':result2
		            		}
		            	]
		            };
		            customHandler(handler.success(type=type,url=url,id=id,episode=episode,down_urls=download_urls));
		          }else{
		            customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=can_not_get_keyword_code,msg=msg_can_not_get_keyword));
		          }
		      });
			}).on('error', function(e) {
			  	customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=can_not_get_source_code,msg=msg_can_not_get_source));
			});
		}else{
			customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=url_not_right_code,msg=msg_url_not_right));
		}
	}
};

module.exports = Letv;