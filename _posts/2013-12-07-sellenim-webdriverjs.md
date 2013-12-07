---
layout : post
comments: true
weibo: 2318464877

summary : "记的去年某公司写了个抢火车票浏览器插件，一时间火的不已乐乎，其实这个实现很简单，对于开发者而言你可已把浏览器插件的运行环境，当成是一个server环境，比如我前段时间写的baidu音乐批量下载工具。用e2e自动化测试工具原理也是一样，也可以达到同样的效果，甚至更强大，今天用WebDriver做了一个自动发”微博“的小程序，有图有真相，先看效果："
title : "使用自动化端到端(entToend)测试工具,批处理你的日常生活"
---

***

>什么是端到端end-to-end测试呢？

简单的说就是，软件程序开发完成后，需要QA进行用例测试，端到端测试就是用程序模拟人的操作过程，从而提高测试人员的工作效率，再简单点说，很像游戏外挂，而且还是开发游戏的厂家自己开发的外挂 - -！！！

>现在端到端的测试工具都有哪些呢？

在我看来大致分成3大类：

1.基于Kramra的,如angular-seed

2.基于Selenium的,如WebDriver,protractor

3.基于浏览器插件的

基本上现在市面上流行的前两种居多，基于浏览器插件的也是一种可能的实现，他们的原理都相似，就是绕过浏览器的沙箱的环境，在类浏览器客户端环境下进行html,js的跨域操作.Kramra并不是生来就是为了当“外挂”的，它的目的是方便web开发人员在做javascript的单元测试的时候，可以直接在命令行下看到测试结果，省去了每次都要打开浏览器的操作，现在你每次save的时候不光可以执行jshint了，还可已跑一边unit
test
了,开发速度又提高了好几万秒,那他怎么的就用来做e2e测试了呢，因为krama简单的说是一个web服务，执行的时候会根据你的配置启动相应的本地浏览器,这就使e2e测试变成可能.Selenimu是一个很老的天生的“外挂“，只不过是用java实现的.最近的WebDriverJS是一个用nodejs封装的调用selenium可执行jar包的应用程序，protractor也是基于WebDriver的，只不过是针对AngularJS的API做了特定封装，所以不具有普试性。

>基本上所有自动化测试工具，都可以当然黑客工具来批处理你的生活.

记的去年某公司写了个抢火车票浏览器插件，一时间火的不已乐乎，其实这个实现很简单，对于开发者而言你可已把浏览器插件的运行环境，当成是一个server环境，比如我前段时间写的baidu音乐批量下载工具。用e2e自动化测试工具原理也是一样，也可以达到同样的效果，甚至更强大，今天用WebDriver做了一个自动发”微博“的小程序，有图有真相，先看效果：


***


!['asdf'](/post-images/e2e.gif)


***
>实现过错如下：

首先下载，selenium可执行jar包
http://chromedriver.storage.googleapis.com/index.html

将下载到的jar包，放到path里，向~/.bashrc 里添加

<pre>
export PATH=/yourDriverPath:$PATH;
</pre>


weibo.js

<pre>
module.exports = {
  message: '使用selenimu javascrit binding 端到端的自动化测试工具,完成诸如抢票插件，定时发微薄、自动填周报、自动录考勤神马的批处理行为，都很容易,让e2e测试工具，变成你的生活小助手.@TheFrontEnd,@iFrankWu.',
  selector: {
    username: 'username',
    password: 'password',
    login: 'a.W_btn_g',
    message: 'textarea.input_detail',
    send: 'a.send_btn'
  },
  url: 'http://weibo.com'
};
</pre>

acount.js

<pre>
module.exports = {
  username: 'your-weibo-acout',
  password: 'your-password'
};
</pre>


send.js
<pre>
var $w = require('./weibo.js');
var $acount = require('./acount.js');
var $s = $w.selector;

var webdriver = require('selenium-webdriver');
var $ = webdriver;


var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();


driver.get($w.url);
driver.findElement(webdriver.By.name($s.username)).sendKeys($acount.username);
driver.findElement(webdriver.By.name($s.password)).sendKeys($acount.password);
driver.findElement(webdriver.By.css($s.login)).click();

driver.findElement($.By.css($s.message)).sendKeys($w.message);
driver.findElement(webdriver.By.css($s.send)).click();
driver.quit();
</pre>


>执行

node send.js




