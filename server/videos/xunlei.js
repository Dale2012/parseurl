var format = require('format');
var xunlei = require('./module/xunlei/update');
var error = require('./error');
var requestUrl = 'http://i.vod.xunlei.com/req_get_method_vod?url=%s&sessionid=%s&vip=0&from=vlist&cache=1374740797180&platform=0&userid=%s';
var requestDensity = 'http://i.vod.xunlei.com/vod_dl_all?userid=%s&gcid=%s&filename=%s&t=%s';
/*
*  迅雷获取ed2k播放地址
*/
var Xunlei = {
	getEd2k:function(url,customHandler){
		var needle = require('needle');
		var handler = require('../handlers/XunleiHandler');
		xunlei.getAUseableSessionID(function(sessionID,uid){
			if(sessionID == false){
				customHandler(handler.fail(orginUrl=url,code=error.errorCode.msg_service_not_availiable,msg=error.errorMsg.msg_service_not_availiable));
			}else{
				needle.get(format(requestUrl,url,sessionID,uid),function(err,res,body){
					if(!err && res.statusCode == 200){
						var result = JSON.parse(body);
						console.log(result);
						if(result.resp.error_msg){
							console.log(result.resp.error_msg);
							if(result.resp.ret == 11){
								xunlei.disableAnAccount(sessionID);
								// xunlei.updateAnAccount(sessionID);
								customHandler(handler.fail(orginUrl=url,code=error.errorCode.msg_service_not_availiable,msg=error.errorMsg.msg_service_not_availiable+' errormsg:' +result.resp.error_msg));
							}else{
								customHandler(handler.fail(orginUrl=url,code=error.errorCode.msg_ed2k_not_availiable,msg=error.errorMsg.msg_ed2k_not_availiable + ' ErrorDetail:'+ result.resp.error_msg))
							}
						}else{
							var src_info	=	result.resp.src_info; 
							var vod_url 	= 	result.resp.vodinfo_list[0].vod_url;
							var fileName 	=	src_info.file_name;
							var fileSize 	=	src_info.file_size;
							var gcid 		=	src_info.gcid;
							var opts 		=	{
								headers:{
									'Cookie':'sessionid=' + sessionID
								},
								timeout:5000
							};
							var resultUrl = vod_url + "&start=0&end=" + fileSize;	
							console.log(resultUrl);
							var toRequestDemsityUrl = format(requestDensity,uid,gcid,fileName,new Date().getTime());
								needle.get(toRequestDemsityUrl,opts,function(err,res,body){
									if(!err){
										var result = JSON.parse(body);
										var hd2='',
											hd ='',
											sd ='';
										if(result['Full_HD'].url){
											hd2 = result['Full_HD'].url;
										}

										if(result['HD'].url){
											hd = result['HD'].url;										
										}

										if(result['SD'].url){
											sd = result['SD'].url;
										}
										customHandler(handler.success(orginUrl = url,movieName=fileName,downloadUrl=resultUrl,fileSize = fileSize,hd2 = hd2, hd = hd, sd = sd));
									}else{
										customHandler(handler.fail(orginUrl=url,code=error.errorCode.msg_can_not_play,msg=error.errorMsg.msg_can_not_play));
									}
							});
						}
					}else{
						customHandler(handler.fail(orginUrl=url,code=error.errorCode.msg_net_problem,msg=error.errorMsg.msg_net_problem));
					}
				});
			}
		});
	}
}

module.exports = Xunlei;

// console.log(Xunlei.getEd2k("ed2k://|file|真爱如血.True.Blood.S06E01.中英字幕.WEBrip.720X400-YYeTs人人影视.mp4|313445831|fd0b8c1994479e3e197564df83cb5a18|h=firtrpoe2rs5glmh27lyxqeng3qv36tn|/ed2k%3A%2F%2F%7Cfile%7C真爱如血.True.Blood.S06E01.中英字幕.WEBrip.720X400-YYeTs人人影视.mp4%7C313445831%7Cfd0b8c1994479e3e197564df83cb5a18%7Ch%3Dfirtrpoe2rs5glmh27lyxqeng3qv36tn%7C%2F"),function(result){
// 	console.log(result);
// });