var hessian = require('hessian');
//var map = { 'map' : {key: value, key2: value2} };
//var list = { 'list' : [1, 2, 3] [, type: 'int'] };
var string = "string";
//var int = 123;
//var bool = true;
//var null = null;
var needle = require('needle');
var options = {
  headers    : {
    'Content-Type': "x-application/json"
  }
};
        var buf=new Buffer(8);
	var parameters = 'c' + String.fromCharCode(0x01) + String.fromCharCode(0x00); // call for Hessian 2.0
        parameters += 'm'  + hessian.encode('getAlbum').toString();
        var encodedVal1 = hessian.encode('202225700').toString();
        hessian.encode(buf,'202225700','utf-8');
        console.log(buf);
         console.log(buf.toString('utf8'));
        var encodedVal2 = hessian.encode('202225700').toString();
        var encodedVal3 = hessian.encode('1').toString();
        var encodedVal4 = hessian.encode('0').toString();
        	parameters += 'I' + String.fromCharCode(0x00) + String.fromCharCode(0x00)  + String.fromCharCode(0x00)  +  '202225700';
parameters += 'z';

console.info(encodedVal1);

console.info(encodedVal2);

console.info(encodedVal3);

console.info(encodedVal4);

console.info(parameters);

var parser = new hessian.HessianParser();

      parser.on('call', function(call, offset) {
        console.info(call);
        console.log('call');
     });
    
     parser.on('reply', function(reply, offset) { 
         // Will be called once for each reply
         console.log(reply);
    console.log('reply');
         });
    //
         parser.on('object', function(obj, offset) {
    //         // Will be called once for each object
                console.log(obj);
               console.log('object');
             });
    
         parser.on('error', function(err) {
           console.log('error');  
           console.log(err);
                 // Will only be called once on first error
                 });
    
       //             parser.decode(buf);




needle.post('http://iface2.iqiyi.com/php/xyz/iface/?device_id=a39eeeea4e9eee4e5e71dc3f4ecac6538e242e25&ua=iPad2,1&key=f0f6c3ee5709615310c0f053dc9c65f2&version=3.7&network=1&os=5.0.1&screen_status=2&getother=0', parameters, options, function(err, resp, body){
   console.log(body);
   //console.log(resp);
   console.log(parser.decode(body));
});
