	
	var args = require('system').args;

	var url = args[4];
	var id  = typeof(args[5]) == 'undefined' ? '' : args[5];
	var episode = typeof(args[6]) == 'undefined' ? '' : args[6];

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
		console.log(JSON.stringify(result,null,4));
		// return JSON.stringify(result,null,4);
		casper.exit();
	});