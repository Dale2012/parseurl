var XunleiHandler = {
	success:function(originUrl,movieName,downloadUrl,fileSize){
		return {
			'originUrl':originUrl,
			'movieName':movieName,
			'fileSize':fileSize,
			'down_urls':{
				'source':'xunlei',
				'urls':[
					{
						'file':'mp4',
						'type':'mp4',
						'url':downloadUrl
					}
				]
			},
			'error':false,
			'code':'0000',
			'msg':'success',
		}
	},
	fail:function(originUrl,code,msg){
		return {
			'originUrl':originUrl,
			'error':true,
			'msg':msg
		}
	}
}

module.exports = XunleiHandler;