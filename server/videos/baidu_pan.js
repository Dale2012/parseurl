var error = require('./error');

var type = 'baidu_wangpan';

var baidu_pan = {
get:function(url,id,episode,customHandler){
	var reg = /http:\/\/pan.baidu.com\/share\/link\?shareid=\d+&uk=\d+/g;
	if (r = reg.test(url)) {
		  var handler = require('../handlers/newHandler');
          var http = require('http');
          var data = '';
          http.get(url,function(response){
			response.on('data',function(chunk){
                  data += chunk;
			});
			response.on('end',function(){
			   var videoName = '';
			   var reg_name = /server_filename=".+.mp4"/gim;
	           var r_name = reg_name.exec(data);
	             console.log(data);
	             if (r_name != null) {
	                var reg_name_result = /"(.+.mp4)"/gim;
	                var name_arr = reg_name_result.exec(r_name[0]);
	                if (name_arr != null) {
	                  videoName =  name_arr[1];
	                 
	                }
	             }
			   

               var reg1 = /dlink.*?http.*?"/gim;
               var r1 = reg1.exec(data);
               if (r1 == null) {
	               	customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.can_not_get_keyword_code,msg=error.errorMsg.msg_can_not_get_keyword));
	               	return;
               };
               var result1 = r1[0];
               var reg2 = /"(http.*?)"/gim;
               var r2 = reg2.exec(result1);
               if (r2 == null) {
	               	customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.can_not_get_keyword_code,msg=error.errorMsg.msg_can_not_get_keyword));
	               	return;
               };
               var result2 = r2[1];
               var targetUrl = encodeFunc(result2);//获取真实地址；
               console.log(targetUrl);
               download_urls = {
		            	'source':'baidu_wangpan',
		            	'urls':[
		            		{
		            			'file':'mp4',
		            			'type':'mp4',
		            			'url':targetUrl
		            		}
		            	]
		            };

                 customHandler(handler.success(type=type,url=url,id=id,movieName = videoName,episode=episode,down_urls=download_urls));
			});

          }).on('error',function(e){
            customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_can_not_get_source,msg=error.errorMsg.msg_can_not_get_source));
          });
	}
	else{
		//url 正则检查没通过；
         customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_url_not_right,msg=error.errorMsg.msg_url_not_right));
	}

}

};

function encodeFunc(str){
	var tempstr = str.replace(/\\/g,"");
	if(tempstr.search(/\\/g) == -1){
		return  tempstr;
	}
	else{
       encodeFunc(tempstr);
	}
}
module.exports = baidu_pan;
