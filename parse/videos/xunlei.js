var format = require('format');
var int64 = require('./module/ReadWrite64');
var buffer = require('buffer');
// var bufferpack = require('bufferPack');
var sessionID = 'D6811A9845879247ECD413ECB28A721BBB6C443D9441FAC8D0F4DCAD6EBA7F15DF47EC4FC6D11BD23120061802138ADCF30F29348D7CA5BD2526185248E337CC6C06B46EC6948D1347D209A5C16EC145';
var requestUrl = 'http://i.vod.xunlei.com/req_get_method_vod?url=%s&sessionid=%s&vip=1&from=vlist&cache=1374740797180&platform=0&userid=47105033';

//计算文件ID
// function calcFid(cid,fileSize,gcid){
// 	var size_buf = new Buffer(8);
// 	int64.writeUInt64(size_buf, fileSize , 0, 'little');

// 	var cid_buf = new Buffer(cid,'hex'),
// 		gcid_buf = new Buffer(gcid,'hex');

// 	var result_buf = new Buffer(48);

// 	cid_buf.copy(result_buf,0);
// 	size_buf.copy(result_buf,20);
// 	gcid_buf.copy(result_buf,28);

// 	console.log(result_buf);

// 	var res = bufferpack.pack("<48A",[result_buf]);
// 	var result = res.toString('base64');
// 	return result;
// }

var Utils = {
	getQueryFromUrl:function(strUrl,key){
		var reg = /[\\?&]([^&=]+)=([^&=]+)/gi;
		while(r = reg.exec(strUrl)){
			if(r[1] === key){
				return r[2];
			}
		}
		return "undefined";
	}
}

var Xunlei = {
	getEd2k:function(url,customHandler){
		var needle = require('needle');
		var handler = require('../handlers/XunleiHandler');
		console.log(format(requestUrl,url,sessionID));
		needle.get(format(requestUrl,url,sessionID),function(err,res,body){
			if(!err && res.statusCode == 200){
				console.log(body)
				var result = JSON.parse(body);
				console.log(result);
				if(result.resp.error_msg){
					customHandler(handler.fail(originUrl=url,code='100',msg=result.resp.error_msg));
				}else{
					console.log(result.resp);
					var src_info	=	result.resp.src_info; 
					var vod_url 	= 	result.resp.vodinfo_list[0].vod_url;
					var fileName 	=	src_info.file_name,
						gcid 		=	src_info.gcid,
						fileSize 	=	src_info.file_size,
						cid  		=	src_info.cid,
						cc 	 		= 	Utils.getQueryFromUrl(vod_url,'cc'),
						it 			=	Utils.getQueryFromUrl(vod_url,'it'),
						dt 			=	Utils.getQueryFromUrl(vod_url,'dt'),
						g 			=	Utils.getQueryFromUrl(vod_url,'g'),
						n 			=	Utils.getQueryFromUrl(vod_url,'n');

					console.log('filename:'+fileName);
					console.log('gcid:'+gcid);
					console.log('cid:'+cid);
					console.log('fileSize:'+fileSize);
					console.log('cc:'+cc);
					console.log('it:'+it);
					console.log('dt:'+dt);
					console.log('g:'+g);
					console.log('n:'+n);
					console.log("vod_url:"+vod_url);
					
					// var fid = calcFid(cid,fileSize,gcid);

					// var resultUrl = format(downloadUrl,fid,g,gcid,cc,it,dt);
					// var resultUrl = format(realUrl,g,dt,it,cc);
					// var resultUrl = format(last,dt,g,it,cc,n);
					var resultUrl = vod_url + "&start=0&end=" + fileSize;
					customHandler(handler.success(originUrl=url,movieName=fileName,downloadUrl=resultUrl,fileSize=fileSize));
				}
			}else{
				customHandler(handler.fail(originUrl=url,code="-1",msg="无法获取源代码"));
			}
		});

	}
}

module.exports = Xunlei;