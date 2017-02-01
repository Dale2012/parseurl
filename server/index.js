var express =	require('express');
var app     = 	express();
var handler =   require('./handlers/Handler');
var xunleiconfig  =   require('./controller/xunleiconfig')

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('jade', require('jade').__express);
app.engine('html', require('ejs').renderFile);

global.BASE_DIR = __dirname;

app.all('/letv/',function(req,res){
	var target_url 	=	req.query.url,
		id 			=	req.query.id,
		episode		=	req.query.episode;
	var letv 		=	require('./videos/letv');

	console.log("target:"+target_url);
	console.log('id:'+id);
	console.log('episode:'+episode);

	letv.get(url=target_url,handler=handler,id=id,episode=episode,customHandler=function(result){
		res.header('Content-Type','application/json');
		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(result);
	});
});

app.all('/xunlei/',function(req,res){
	var ed2k = req.query.url;
	console.log('ed2k');
	var xunlei = require('./videos/xunlei');
	xunlei.getEd2k(ed2k,function(result){
		// console.log(result);
		res.header('Content-Type','application/json');
		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(result);
	});
});
app.all('/56/',function(req,res){
    var target_url 	=	req.query.url,
        id 			=	req.query.id,
        episode		=	req.query.episode;
    var wl 		=	require('./videos/56');

    console.log("target:"+target_url);
    console.log('id:'+id);
    console.log('episode:'+episode);
     var newHandler = require('./handlers/newHandler');
    wl.get(url=target_url,handler=newHandler ,id=id,episode=episode,customHandler=function(result){
        res.header('Content-Type','application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.send(result);
    });
});

app.all('/sohu/',function(req,res){
	var target_url 	= 	req.query.url,
		id 			=	req.query.id,
		episode		=	req.query.episode;
	var sohu 		=	require('./videos/sohu');

	console.log("target:"+target_url);
	console.log('id:'+id);
	console.log('episode:'+episode);

	sohu.get(url=target_url,id=id,episode=episode,customHandler=function(result){
		res.header('Content-Type','application/json');
		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(result);
	});
});

app.get('/funshion/first/',function(req,res){
	var target_url 	=	req.query.url;
	var funshion 	=	require('./videos/funshion');
	console.log('target_url:'+target_url);
	funshion.getVideoInformation(url=target_url,customHandler = function(result){
		res.header('Content-Type','application/json');
		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(result);
	});
});


app.post('/funshion/second/',function(req,res){
	var funshion = require('./videos/funshion');
	console.log('风行收到数据包:' + JSON.stringify(req.body,null,4));

	funshion.getDownloadInformation(req.body,function(result){
		res.header('Content-Type','application/json');
		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(result);
	});
});

app.all('/qiyi/',function(req,res){

	var target_url 	= 	req.query.url,
		id 			=	req.query.id,
		episode		=	req.query.episode;
	var qiyi 		=	require('./videos/qiyi');

	console.log("target:"+target_url);
	console.log('id:'+id);
	console.log('episode:'+episode);

	qiyi.get(url=target_url,id=id,episode=episode,customHandler=function(result){
		res.header('Access-Control-Allow-Origin','*');
		res.send(result);
	});
});
app.all('/youku/',function(req,res){
	var target_url 	= 	req.query.url,
		id 			=	req.query.id,
		episode		=	req.query.episode;
	var youku 		=	require('./videos/youku');

	console.log("target:"+target_url);
	console.log('id:'+id);
	console.log('episode:'+episode);

	youku.get(url=target_url,id=id,episode=episode,customHandler=function(result){
		res.header('Access-Control-Allow-Origin','*');
		res.send(result);
	});
});

//User validation
var auth = express.basicAuth(xunleiconfig.auth,'Xunlei Username and Password');

app.get('/xunlei/config',auth,xunleiconfig.render);
app.post('/xunlei/config',auth,xunleiconfig.update);
app.post('/xunlei/add',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var sessionid= req.body.sessionid;
	var uid 	= req.body.uid;
	console.log(username+" "+ sessionid + " " + uid + " " + password);
	if(username != '' && password  != '' && sessionid != '' && uid != ''){
		var xunleimodify = require('./videos/module/xunlei/modify.js');
		xunleimodify.addAccount(username,password,uid,sessionid,function(status,msg){
			if(status){
				return res.redirect('/xunlei/config?error=false')
			}else{
				return res.redirect('/xunlei/config?error=true')
			}
		})
	}else{
		return res.redirect('/xunlei/config?error=true')
	}
});

app.post('/xunlei/delete',auth,function(req,res){
	console.log(req.body.username);
	var xunleimodify = require('./videos/module/xunlei/modify.js');
	xunleimodify.deleteAccount(req.body.username,function(status,msg){
		if(status){
			return res.redirect('/xunlei/config?error=false');
		}else{
			return res.redirect('/xunlei/config?error=true');
		}
	});
});

app.get('/converter/2magnet',function(req,res){
	res.render('converter.html');
});

app.post('/converter/2magnet',function(req,res){
	var converter = require('./converter/torrent2magnet');
	var torrent = req.files.torrent;
	
	converter.torrent2magnet(torrent.path,function(result){
		res.header('Access-Control-Allow-Origin','*');
		res.send(result);
	});
});

app.all('/baidu/',function(req,res){

	var target_url 	= 	req.query.url,
		id 			=	req.query.id,
		episode		=	req.query.episode;
	var baidu_pan 		=	require('./videos/baidu');

	console.log("target:"+target_url);
	console.log('id:'+id);
	console.log('episode:'+episode);

	baidu_pan.get(url=target_url,id=id,episode=episode,customHandler=function(result){
		res.set('Content-Type','application/json');
		res.header('Access-Control-Allow-Origin','*');
		res.send(result);
	});
});

app.all('/bdhd/',function(req,res){
	var target_url = req.query.url;
	var bdhd = require('./videos/bdhd');
	console.log('百度影音：'+target_url);
	bdhd.get(target_url,function(result){
		res.header('Access-Control-Allow-Origin','*');
		res.send(result);
	});
});

app.all('/xunlei/subtitle/',function(req,res){
	var url = req.query.url;
	var xunlei_subtitle = require('./subtitles/xunlei');
	xunlei_subtitle.get(url,function(result){
		res.send(result);
	});
});

app.listen(3000);
console.log('Listening on port 3000');