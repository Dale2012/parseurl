/*
	风行的处理模块，因为风行比较特别。
*/

var FunshionHandler = {
	// updateUrl:'/manager/collect/updateVideoUrl.php',
	firstSuccess:function(url,infos){
		return {
			'type':'funshion',
			'source':url,
			'error':false,
			'code':'0000',
			'video_infos':infos,
			'msg':'success',
		};
	},
	firstFail:function(url,code,msg){
		return {
			'type':'funshion',
			'source':url,
			'error':true,
			'code':code,
			'msg':msg,
		};
	},
	secondSuccess:function(reallinkInfo){
		return {
			'error':'false',
			'msg':'success',
			'urls':reallinkInfo
		}
	},
	secondFail:function(code,msg){
		return {
			'error':'true',
			'code':code,
			'msg':msg
		}
	}

}

module.exports = FunshionHandler;