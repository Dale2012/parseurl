##　地址解析

###功能

传入网页播放地址，返回视频真实地址
并且回调给相关更新服务,查看[回调服务接口](https://github.com/joyplus/show-cloud/wiki/%E6%9B%B4%E6%96%B0%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%9C%B0%E5%9D%80)

###目前进度

* [奇艺](http://www.iqiyi.com) 2013-8-1完成
* [youku](http://www.youku.com) 2013-8-1完成
* [迅雷云播](http://vod.xunlei.com) 2013-7-31完成
* [风行](http://www.funshion.com)完成
* [乐视](http://www.letv.com) 2013-7-21* 
* [搜狐视频](http://tv.sohu.com)  2013-7-21 较为特殊

###实现原理

* 乐视网的实现原理较为简单，通过获取源码，并且base64解码即可获得真实的播放地址
* sohu视频实现原理较为复杂，并且依赖环境也较多，通过模拟真实的浏览器处理，来实现视频播放地址获取，因而，对搜狐视频的处理，采用了单独服务，端口9999。当`index.js`获得关于sohu的请求时，会去请求本地开启的sohu服务来获取搜狐视频相关信息。

###部署方式

1.	参考[phantomjs](http://phantomjs.org/download.html) 以及 [casperjs](http://docs.casperjs.org/en/latest/installation.html)的安装指南，在服务器端部署`phantomjs`以及`casperjs`。
2.	通过`phantomjs -version`以及`casperjs -v`指令查看是否安装成功。
3.	上传`server`以及`sohu`文件夹
4.	在`server`目录下，调用`npm install`，自动安装相关依赖。
4.	`cd`至`sohu`文件夹 ，调用`nohup casperjs sohu.js &`启动`sohu`的解析引擎。
5.	`cd`致`server`文件夹，调用`forever -l out.log index.js &`启动服务。

###服务接受参数说明

1.	`url` [必须] 代表视频的播放页面地址。
2.	`episode` [可选] 代表视频集数，用于内部请求回调用。
3.	`id` [可选] 代表productID，用于内部回调用。

###试例

`/letv/?url=http://www.letv.com/ptv/pplay/85827.html&id=3&episode=3`

返回

	{
	
		id: "3",
		source: "http://www.letv.com/ptv/pplay/85827.html",
		episode: "3",
		error: false,
		code: "0000",
		msg: "success",
		down_urls: {
		source: "letv",
		urls: [
				{
					file: "mp4",
					type: "flv",
					url: "http://g3.letv.cn/vod/v2/MzMvMjgvMy9sZXR2LXV0cy80Mzc0NjYyLUFWQy0yNTkzNzgtQUFDLTMyMDAwLTc1ODI5NjAtMjc5NTUwMjU0LWU2MzQ5MTQxOWU3NTMxZjNlMzNmYjllMTA0ZTRhYTYxLTEzNzA4NjM2ODY5NzcubXA0?b=294&mmsid=2681255&tm=1374341191&key=3c41af31eb65193f281e7035fba57634&platid=1&splatid=101&playid=0&tss=no"
				},
				{
					file: "mp4",
					type: "mp4",
					url: "http://g3.letv.cn/vod/v2/MzMvMjgvMy9sZXR2LXV0cy80Mzc0NjY5LUFWQy01NDc3MzgtQUFDLTMyMDAwLTc1ODI5NjAtNTUyODY5NDQ3LTFhZDBhNGRmYmE4NDMzYWUwNDJjMzViODMzZTI1NmNmLTEzNzA4Njk1OTU5ODcubXA0?b=583&mmsid=2681255&tm=1374341191&key=2147209d19afbb4bfcf5c0e5ca1b2ea0&platid=1&splatid=101&playid=0&tss=no"
				}
			]
		}
	}		
	
###关于错误码

查看[动态获取视频真实地址错误代码](https://github.com/joyplus/joyplus-cms/wiki/%E9%94%99%E8%AF%AF%E7%BC%96%E7%A0%81)