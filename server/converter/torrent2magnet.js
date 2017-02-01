var bencode = require('dht-bencode');
var fs = require('fs');
var bases = require('bases');
var format = require('format');
var xunlei = require('../videos/xunlei');

var Result = {
	success:function(magnet){
		return {
			'error':'false',
			'code':'0000',
			'magneturi':magnet
		};
	},
	fail:function(msg,code){
		return {
			'error':'true',
			'code':code,
			'msg':msg
		};
	}
};

var Error = {
	'msg_can_not_read_file':{
		'msg':'无法读取文件',
		'code':'4001'
	}
};

var Converter = {
	torrent2magnet:function(path,customHandler){
		console.log(path);
		fs.readFile(path,function(err,data){
			if(!err){
				var sha1 = require('crypto').createHash('sha1');
				var metadata 			= bencode.bdecode(data);
				var	benMetaInfo 		= bencode.bencode(metadata['info']);
				var	sha1Result  		= sha1.update(benMetaInfo).digest('hex');
				var magneturi = 'magnet:?xt=urn:btih:%s';
				magneturi = format(magneturi,sha1Result);
				xunlei.getEd2k(magneturi,function(result){
					customHandler(result);
				});
			}else{
				customHandler(Result.fail(Error.msg_can_not_read_file.code,Error.msg_can_not_read_file.msg));
			}
		});
	}
}

module.exports = Converter;
