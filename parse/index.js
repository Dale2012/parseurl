var express =	require('express');
var app     = 	express();
var handler =   require('./handlers/Handler');


app.use(express.bodyParser());

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

app.all('/sohu/',function(req,res){
	var target_url 	= 	req.query.url,
		id 			=	req.query.id,
		episode		=	req.query.episode;
	var sohu 		=	require('./videos/sohu');

	console.log("target:"+target_url);
	console.log('id:'+id);
	console.log('episode:'+episode);

	sohu.get(url=target_url,handler=handler,id=id,episode=episode,customHandler=function(result){
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
	console.log(req.body);
	funshion.getDownloadInformation(req.body,function(result){
		res.header('Content-Type','application/json');
		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(result);
	});
});

app.listen(3000);
console.log('Listening on port 3000');