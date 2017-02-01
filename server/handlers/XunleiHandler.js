var XunleiHandler = {
	success:function(originUrl,movieName,downloadUrl,fileSize,hd2,hd,sd){
		hd = typeof hd !== 'undefined' ? hd:'';
		hd2 = typeof hd2 !== 'undefined' ? hd2:'';
		sd = typeof sd !== 'undefined' ? sd:'';
		return {
			'type':'xunlei',
			'originUrl':originUrl,
			'movieName':movieName,
			'fileSize':fileSize,
			'down_urls':{
				'source':'xunlei',
				'urls':[
					{
						'file':'mp4',
						'type':'flv',
						'url':downloadUrl
					},
					{
						'file':'mp4',
						'type':'hd2',
						'url':hd2
					},
					{
						'file':'mp4',
						'type':'hd',
						'url':hd
					},
					{
						'file':'mp4',
						'type':'mp4',
						'url':sd
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
			'type':'xunlei',
			'originUrl':originUrl,
			'error':true,
			'msg':msg
		}
	}
}

module.exports = XunleiHandler;