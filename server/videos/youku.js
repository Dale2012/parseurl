var error = require('./error');

var Liu_Chang  = '3GP',
    NORMAL     = 'flv',
    HIGH_CLEAR = 'mp4',
    TOP_CLEAR  = 'hd2';

var realUrl1 = null;
var realUrl2 = null;
var realUrl3 = null;
var realUrl4 = null;
var realUrl5 = null;

var targetArr = null;
var download_urls = null;
var allUrls = null;

var type = 'youku';
var videoName = '';
var youku = {
	get:function(url,id,episode,customHandler){
	  var handler = require('../handlers/newHandler');
	  targetArr = null;
      targetArr = new Array();
      var http = require('http');
      var data;
      var reg = /http:\/\/v.youku.com\/.+?.html/g;
      if (reg.test(url)) {
	       http.get(url,function(response){
            //url right;
            response.on('data',function(chunk){
                data += chunk;
            });

            response.on('end',function(){
                
                var videoId1 = null;
                var videoId2 = null;
                var input = data;
                videoName = '';
			   var reg_name = /<title>.+<\/title>/gim;
	           var r_name = reg_name.exec(input);
	             if (r_name != null) {
	                var reg_name_result = /<title>(.+)<\/title>/gim;
	                var name_arr = reg_name_result.exec(r_name[0]);
	                if (name_arr != null) {
	                  videoName =  name_arr[1];

	                }
	             }
                console.log(videoName);
                //获取mp4地址；
                var reg1 = /videoId = '\d+'/gim;
                var reg2 = /videoId2= '[\w=]+?'/gim;
                
                var r1 = reg1.exec(input);

                allUrls = null;
                allUrls = new Array();

                if(r1 != null){
                  var reg_digit = /\d+/;
                  videoId1 = reg_digit.exec(r1[0])[0];
	                  realUrl1 = {
	                         hostname:'m.youku.com',
	                         path:'/wap/pvs?id='+ videoId1 + '&format=3gphd'
	                  };
	                  allUrls.push(realUrl1);
                }
                
                //获取m3u8的地址；
                var r2 = reg2.exec(input);
                if(r2 != null){
	            	var reg_w = /'(.*?)'/;
	                videoId2 = reg_w.exec(r2[0])[1];
	                var baseUrl = '/player/getM3U8/vid/{PROD_ID}/type/{mType}/ts/{now_date}/useKeyframe/0/v.m3u8';
					var url_prodId = baseUrl.replace(/{PROD_ID}/,videoId2);
					var date = new Date();

					var url_target = url_prodId.replace(/{now_date}/,Math.ceil(date.getTime()/1000));
					realUrl2 = {
						'hostname':'v.youku.com',
						'path':url_target.replace(/{mType}/,Liu_Chang)

					};
					realUrl3 = {
						'hostname':'v.youku.com',
						'path':url_target.replace(/{mType}/,NORMAL)

					};
					realUrl4 = {
						'hostname':'v.youku.com',
						'path':url_target.replace(/{mType}/,HIGH_CLEAR)

					};
				    realUrl5 = {
						'hostname':'v.youku.com',
						'path':url_target.replace(/{mType}/,TOP_CLEAR)

					};
					allUrls.push(realUrl2,realUrl3,realUrl4,realUrl5);
                }
                 
                 //
	              try {
					　　ChecKUrls(handler,id,episode,customHandler);
				  }
				  catch (error) {
					　　console.log(error);
				  }
            });

	       }).on('error',function(e){
             // url error;
              customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_can_not_get_source,msg=error.errorMsg.msg_can_not_get_source));

	       });
      }
      else {
         //正则检查不过；
         customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.msg_url_not_right,msg=error.errorMsg.msg_url_not_right));

      }

	}
};

var counter = 0;

function requestUrl(dic_info,callBack){
   var http = require('http');
   var url = dic_info['url'];
   console.log(url);
	var options = {
	  hostname: 'm.youku.com',
	  port: 80,
	  path: '/wap/pvs?id=142032244&format=3gphd',
	  method: 'POST'
	};
	var req = http.request(options, function(res) {
	  if (res.statusCode>= 200 || res.statusCode < 299) {
           callBack(dic_info,1);
	   }
	   else{
           callBack(dic_info,0);
	   }
	  counter++;
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	  callBack(dic_info,0);
	  counter++;
	});
	req.end();
}

function ChecKUrls(handler,id,episode,customHandler){
	counter = 0;
	for(var i = 0;i<allUrls.length;i++){
		var  oneDic = null;
			switch(i){
				case 0:{
		        oneDic = {
	              'file':'mp4',
	              'type':'mp4',
	              'url':'http://'+(allUrls[0])['hostname']+allUrls[0].path
	             };
					break;
				}
				case 1:{
				oneDic = {
	              'file':'m3u8',
	              'type':Liu_Chang,
	              'url':'http://'+(allUrls[1])['hostname']+allUrls[1].path
	             };
					break;
				}
				case 2:{
			    oneDic = {
			      'file':'m3u8',
			      'type':NORMAL,
			      'url':'http://'+(allUrls[2])['hostname']+allUrls[2].path
			     };
					break;
				}
				case 3:{
			    oneDic = {
			      'file':'m3u8',
			      'type':HIGH_CLEAR,
			      'url':'http://'+(allUrls[3])['hostname']+allUrls[3].path
	             };
					break;
				}
				case 4:{
			    oneDic = {
			      'file':'m3u8',
			      'type':TOP_CLEAR,
			      'url':'http://'+(allUrls[4])['hostname']+allUrls[4].path
			     };
					break;
				}
				default:
				break;
			}

            console.log(oneDic);
	        requestUrl(oneDic,function(info,value){
	        	if (value == 1) {
                   targetArr.push(info);
	        	}

                if (counter == allUrls.length-1) {
               	    console.log('all request back');
               	    download_urls = {
				        'source':'youku',
				        'urls':targetArr
			        };
			    if (allUrls.length > 0) {
                   customHandler(handler.success(type=type,url=url,id=id,movieName=videoName,episode=episode,down_urls=download_urls));
			    }
			    else{
                   customHandler(handler.fail(type=type,url=url,id=id,episode=episode,code=error.errorCode.can_not_get_source_code,msg=error.errorMsg.msg_can_not_get_source));
			    }

                };
	        });
	}

}

module.exports = youku;
