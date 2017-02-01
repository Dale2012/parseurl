##地址解析引擎

###真实需求

在系统运行过程中，客户端向[joyplus-cms](https://github.com/joyplus/joyplus-cms)获取影视数据，解析并且播放。

__但是__

在某些场景下，从[joyplus-cms](https://github.com/joyplus/joyplus-cms)中获取的视频地址信息可能出现无法播放的状况。

__这时__

就需要一个可以实时获取真实地址的服务来解决用户即刻要看视频的需求，地址解析引擎就提供了这样的服务，并且提供了额外的的功能，就是将正确的地址回调到[joyplus-cms](https://github.com/joyplus/joyplus-cms)中，查看[回调服务接口](https://github.com/joyplus/show-cloud/wiki/%E6%9B%B4%E6%96%B0%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%9C%B0%E5%9D%80)。

###架构方案

开发语言：nodejs

开发环境：centOS

开发框架：

1.  [express](http://expressjs.com/)
2.  [phantomjs](http://phantomjs.org/)
3.  [casperjs](http://casperjs.org/)

开源库：

1.	[needle](https://github.com/tomas/needle) 用于处理`http`请求

###目录说明：

`sohu` : 搜狐视频处理服务，需要单独运行。 [进一步了解](./sohu/)

`server`:接受请求和中转,以及回调服务。 [进一步了解](./server/)