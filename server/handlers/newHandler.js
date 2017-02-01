var needle = require('needle');

var post_url = "http://cmstest.yue001.com/manager/collect/updateVideoUrl.php";


var ResultHandler = {
	success:function(type,url,id,movieName,episode,down_urls){
		var mp4 = '',
			flv = '',
			hd2 = '';
		
		var urls = down_urls.urls;
		for(var info in urls){
			if(urls[info].type == 'mp4'){
				mp4 = urls[info].url;
				mp4 = 'mp4{m}'+mp4;
			}else if(urls[info].type == 'hd2'){
				hd2 = urls[info].url;
				hd2 = 'hd2{m}'+hd2;
			}else if(urls[info].type == 'flv'){
				flv = urls[info].url;
				flv = 'flv{m}'+flv;
			}
		}
		if(typeof id === "undefined" || typeof episode === "undefined"){
			console.log('no need callback');
		}else{
			var urls_data = ''	+ (mp4.length == 0? '':mp4+'{mType}')
							+ (flv.length == 0? '':flv+'{mType}')
							+ (hd2.length == 0? '':hd2);
			var target_url  = post_url+'?id='+id+"&name="+episode+"&urls="+urls_data+"&from="+type;
			console.log('url:'+target_url);
			needle.get(target_url,function(err,res,body){
				if(!err && res.statusCode == 200){
					console.log('ok');
				}else{
					console.error('error');
				}
			});
		}
        movieName = encodeURIComponent(movieName);
		return {
			'id':id,
			'movieName':movieName,
			'source':url,
			'episode':episode,
			'error':false,
			'code':'0000',
			'msg':'success',
			'down_urls': down_urls,
		}
	},
	fail:function(type,url,id,episode,code,msg){
		if(typeof(id) == "undefined" || typeof(episode) == "undefined"){
			console.log('Fail but no need callback');
		}else{
			needle.post(post_url,{
				'appkey':'',
				'id':id,
				'name':episode,
				'error':true,
			},{timeout:5000},function(err,res,body){
				if(err || res.statusCode != 200){
					console.error('server down');
				}
			});
		}
		return {
			'id':id,
			'source':url,
			'episode':episode,
			'error':true,
			'code':code,
			'msg':msg,
		}
	}
}

module.exports = ResultHandler;