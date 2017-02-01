var server = require('webserver').create();


var listing = server.listen('127.0.0.1:9999',function(request, response){
	var reg = /[\\?&]([^&=]+)=([^&=]+)/gi;

	var url,
		id,
		episode;	

	var m3u8 = {},
		mp4,
		downloadUrl;
	while(r = reg.exec(request.url)){
		if(r[1] === 'url'){
			url = r[2];
			var sohu_format = /http:\/\/((?:my.)?tv.sohu.com)(.+?html)/g
			if(!sohu_format.test(url)){
				var result = {
					'type':'sohu',
					'error':true,
					'msg':'错误的URL',
					'code':'0001',
				};
				response.write(JSON.stringify(result,null,null));
				response.close();
			}
		}else if(r[1] == 'id'){
			id = r[2];
		}else if(r[1] == 'episode'){
			episode = r[2];
		}
	}

	var casper = require('casper').create({
	 pageSettings: {
        loadImages:  false,        
        loadPlugins: false,  
    	},
    	verbose:false
	});

	function get_m3u8(){
		return VideoData.urls.m3u8;
	}
	function get_download_url(){
		return VideoData.urls.downloadUrl;
	}
	function get_mp4(){
		return VideoData.urls.mp4;
	}

	casper.userAgent('Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10');

	casper.start(url);

	casper.then(function(){
		m3u8 = this.evaluate(get_m3u8);
		mp4  = this.evaluate(get_mp4);
		downloadUrl = this.evaluate(get_download_url);
	});
	casper.run(function(){
		response.statusCode = 200;
		var low,middle,high;
		for(var i in m3u8){
			if(i == 0)
				low = m3u8[i];
			if(i == 1)
				middle = m3u8[i];
			if(i == 2)
				high = m3u8[i];
		}

		var result = {
			'type':'sohu',
			'id':id,
			'episode':episode,
			'down_urls':{
				'source':'letv',
				'urls':[
					{
						'file':'m3u8',
						'type':'mp4',
						'url':middle,
					},
					{
						'file':'m3u8',
						'type':'hd2',
						'url':high,
					}
				]
			}
		};
		console.log(JSON.stringify(result,null,null));
		response.write(JSON.stringify(result,null,null));
		response.close();
	});
});

