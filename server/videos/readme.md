##关于sohu真实地址解析

###原理

搜狐视频地址解析通过模拟webkit下的ipad浏览器实现。

`nodejs` `exec`调用。

###工具

[phantomjs](https://github.com/ariya/phantomjs/):`nodejs`下模拟`webkit`浏览器行为的开源库。

[casperjs](http://casperjs.org/):对`phantomjs`的封装，实现了同步功能。

###安装方法：

`phantomjs`请参考：[phantomjs download](http://phantomjs.org/download.html)

`casperjs`请参考：[casperjs installation](http://docs.casperjs.org/en/latest/installation.html)

###调用搜狐视频解析服务方法

`casperjs sohu.js [搜狐视频地址] [id] [episode]`

nodejs中用`exec`调用 `stdout`为`json`输出。