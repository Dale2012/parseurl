var fs = require('fs');
var ConfigXunlei = {
	render:function(req,res){
		fs.readFile('videos/config/xunlei.conf',function(err,data){
			if(!err){
				var result = JSON.parse(data);
				res.render('xunlei.html',{data:result.accounts});
			}
		});
	},
	update:function(req,res){
		if(req.body.sessionid != '' && req.body.username != ''){
			fs.readFile('videos/config/xunlei.conf',function(err,data){
			if(!err){
				var result = JSON.parse(data);
				var accounts = result.accounts;
				for(var i in accounts){
					if(accounts[i].username === req.body.username){
						accounts[i].sessionid = req.body.sessionid;
						accounts[i].expire  = false;
						break;
					}
				}
				fs.writeFile('videos/config/xunlei.conf',JSON.stringify(result,null,4),function(err){
					if(!err){
						res.render('xunlei.html',{data:result.accounts,msg:'success'});
					}else{
						res.render('xunlei.html',{data:result.accounts,msg:'fail'});
					}
				})
			}
			});
		}
	},
	auth:function(user,pass){
		var content = fs.readFileSync('videos/config/xunlei.conf');
		var result = JSON.parse(content);
		var accounts = result.accounts;
		for(var i in accounts){
			console.log(accounts[i].username + " " + accounts[i].password);
			if(accounts[i].username == user && accounts[i].password == pass){
				return true;
			}
		}
		return false;
	}
}

module.exports = ConfigXunlei;