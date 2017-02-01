var BDHDHandler = {
	success:function(url,urls){
		return {
			'from':'bdhd',
			'url':url,
			'error':'false',
			'code':'0000',
			'down_urls':{
				'source':'bdhd',
				'urls':urls
			}
		}
	},
	fail:function(url,code,msg){
		return {
			'from':'bdhd',
			'url':url,
			'error':'true',
			'code':code,
			'msg':msg
		};
	}
}

module.exports = BDHDHandler;