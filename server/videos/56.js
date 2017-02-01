
var url_not_right_code = '3000',
	can_not_get_keyword_code = '3001',
	can_not_get_source_code  = '3002';

var msg_url_not_right = 'url地址不正确',
	msg_can_not_get_source = '无法获取源代码',
	msg_can_not_get_keyword = '无法获取关键字';

//for example
// http://localhost:3000/56/?url=http://www.56.com/u71/v_OTQ5Njk5MjQ.html
// http://localhost:3000/56/?url=http://www.56.com/w30/play_album-aid-11682604_vid-OTIxNDgyNTY.html
function getBody(body,startStr,endStr){
    if(body == undefined || body ==''){
        return false;
    }
    if(startStr == undefined || startStr ==''){
        return false;
    }
    if(endStr == undefined || endStr ==''){
        return false;
    }
    if(body.indexOf(startStr) !=-1) {
//         log.info(body.indexOf(startStr));
        var str = body.substr(body.indexOf(startStr) + startStr.length)   ;
//         log.info(str.indexOf(endStr));
        str = str.substring(0,str.indexOf(endStr));
        return str;
    }
    return false;
}
var WL =	{
	get:function(url,handler,id,episode,customHandler){
		var type = '56';
        var reg = /http:\/\/www.56.com\/.+?.html/g;
		if(reg.test(url)){
            var needle = require('needle');
            var videoName='';
            needle.get(url,function(err,res,body){
                if(!err && res.statusCode == 200){
                    videoName= getBody(body,'<title>','<\/title>');
                    if(videoName.indexOf('_') !=-1) {
                        videoName=videoName.substr(0,videoName.indexOf('_'))   ;
                    }  else  if(videoName.indexOf('-') !=-1) {
                        videoName=videoName.substr(0,videoName.indexOf('-'))   ;
                    }
                    //videoName=decodeURI(videoName)  ;
                }
                console.info("video name: "+videoName);
                var reg   = /v_(.+?).html/g;
                var result;
                if(r = reg.exec(url)){
                    console.info(r);
                    result = new Buffer(r[1],'base64').toString('ascii');
                    download_urls = {
                        'source':'56',
                        'urls':[
                            {
                                'file':'mp4',
                                'type':'m3u8',
                                'url':'http://vxml.56.com/m3u8/'+result+'/'
                            }

                        ]
                    };
                    customHandler(handler.success(type=type,url=url,id=id,movieName=videoName,episode=episode,down_urls=download_urls));
                }else{
                    var reg1   = /vid-(.+?).html/g;
                    if(r = reg1.exec(url)){
                        console.info(r);
                        result = new Buffer(r[1],'base64').toString('ascii');
                        download_urls = {
                            'source':'56',
                            'urls':[
                                {
                                    'file':'mp4',
                                    'type':'m3u8',
                                    'url':'http://vxml.56.com/m3u8/'+result+'/'
                                }

                            ]
                        };
                        customHandler(handler.success(type=type,url=url,id=id,movieName=videoName,episode=episode,down_urls=download_urls));
                    }else {
                        customHandler(handler.fail(type=type,url=url,id=id,episode=episode,movieName=videoName,code=can_not_get_keyword_code,msg=msg_can_not_get_keyword));
                    }
                }
            });

		}else{
			customHandler(handler.fail(type=type,url=url,id=id,movieName=videoName,episode=episode,code=url_not_right_code,msg=msg_url_not_right));
		}
	}
};

module.exports = WL;