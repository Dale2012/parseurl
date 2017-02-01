var error = require('./error');

var qiyi = {

	get:function(url,id,episode,customHandler){
			var http = require('http');
			var handler = require('../handlers/newHandler');
			var type = 'qiyi';
            var data;
            var download_urls;
			var reg = /http:\/\/www.iqiyi.com\/.+?.html/g;
					if (reg.test(url)) {
							http.get(url, function(response) {
							response.on('data',function(chunk){
					          data += chunk;
					  		});
						    response.on('end',function(){
						      var input = data;

						      var videoName = '';
						      var reg_name = /data-drama-albumname=".+"/gim;
						      var r_name = reg_name.exec(input);
						      if (r_name != null) {
						      	var reg_name_result = /"(.+)"/gim;
						      	var video_name_r = reg_name_result.exec(r_name[0]);
						      	if (video_name_r != null) {videoName = video_name_r[1];
						      	}  
						      }
                              console.log(videoName);
					          var reg   = /data-drama-tvid="\d+"/gim;  
					          r = reg.exec(input);
					          if(r == null || r == ""){
                                                    reg  = /"tvId":"\d+"/gim;;
                                                    r = reg.exec(input);
					          }
					          if(r){
					            //获取tvid；
					          	var reg_digit = /\d+/;
					          	var r1 = reg_digit.exec(r[0]);
					          	var vid = r1[0];

					            //从真实地址中获取数据；
					            var realUrl = 'http://cache.m.iqiyi.com/mt/'+vid+'/';
					            var result_data = '';
					            http.get(realUrl,function(result){
	                                result.on('data',function(ch){
                                      result_data += ch;
	                                });
	                                result.on('end',function(){
                                     var jsonValue = JSON.parse(result_data); 
                                     var allurls = null;
			            try {
									　　 allurls = jsonValue.data.mtl.concat(jsonValue.data.mpl);
									 }
									 catch (e) {
									　　customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_url_not_right,msg=error.errorMsg.msg_url_not_right));
									   return;
									 }
                                     var targetArr = new Array();
                                     
	                                     //遍历所有的地址；
	                                     for(var i = 0;i<allurls.length;i++){
	                                     	var type = '';
	                                     	if (allurls[i].vd == 1) {type = 'flv'}
	                                     	else if(allurls[i].vd == 2){type ='mp4'}
	                                     	else {type = 'hd2'}

		                                    if (allurls[i].m3u) {
		                                       var  oneDic = {
		                                          'file':'m3u8',
		                                          'type':type,
		                                          'url':allurls[i].m3u
		                                         };
		                                         targetArr.push(oneDic);
		                                     }
		                                     if(allurls[i].m4u){
		                                            var newResult = '';
			                                     	http.get(allurls[i].m4u,function(rr){

													rr.on('data',function(dd){
	                                                   newResult += dd;

													});
													rr.on('end',function(){
													   var reg_new = /"(http.*?)"/;
													   var new_url = (reg_new.exec(newResult))[1];
													     var oneDic = {
				                                           'file':'mp4',
				                                          'type':type,
				                                          'url':new_url
				                                         };
	                                                   targetArr.push(oneDic); 
	                                                  
													});

		                                     	}).on('error',function(ee){
		                                     		
		                                     	});

		                                      }

		                                  }
	                                    //得到最终的视频地址；
	                                     download_urls = {
	                                           'source':'qiyi',
	                                           'urls':targetArr
	                                     };
                                        console.log(download_urls);
                                        customHandler(handler.success(type=type,url=url,id=id,movieName = videoName,episode=episode,down_urls=download_urls));
	                                });

					            }).on('error', function(e) {
			                         	customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_url_not_right,msg=error.errorMsg.msg_url_not_right));
			                    });
					              
					          }else{
					            customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_can_not_get_keyword,msg=error.errorMsg.msg_can_not_get_keyword));
					          }
					      });
						}).on('error', function(e) {
						  	customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_can_not_get_source,msg=error.errorMsg.msg_can_not_get_source));
						});
					}
					else{
						 customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_url_not_right,msg=error.errorMsg.msg_url_not_right));
					}
	  }
};
module.exports = qiyi;
