---
layout : post
title : "Linux Chrome 不支持perspective问题"
comments: true
weibo: 2318464877
summary : ""
image : /assets/imges/chrome.png
---



### 打开 chrome://gpu/
你会发现:

![](/post-images/chrome-gpu-ko.png)

可能你很想把他转化成：

![](/post-images/chrome-gpu-ok.png)


### 打开 chrome://flag/

更改如下配置:

<ul>
<li><strong><span style="color:#008000;">[ON]</span></strong> Override software rendering list (<strong>probably the most important one if your hardware is blacklisted</strong>)</li>
<li><strong><span style="color:#008000;">[ON]</span></strong>&nbsp;GPU compositing on all pages</li>
<li><strong><span style="color:#008000;">[ON]&nbsp;</span></strong>Threaded compositing</li>
<li><strong><span style="color:#ff0000;">[OFF]</span></strong>&nbsp;Disable accelerated 2D canvas</li>
<li><strong><span style="color:#ff0000;">[OFF]&nbsp;</span></strong>Disable deferred 2D canvas</li>
<li><strong><span style="color:#ff0000;">[OFF]&nbsp;</span></strong>Disable accelerated CSS animations</li>
<li><strong><span style="color:#008000;">[ON]&nbsp;</span></strong>GPU Accelerated SVG Filters</li>
<li><strong><span style="color:#ff0000;">[OFF]&nbsp;</span></strong>Disable GPU VSync</li>
<li><strong><span style="color:#ff0000;">[OFF]&nbsp;</span></strong>Disable WebGL</li>
<li><strong><span style="color:#008000;">[ON]&nbsp;</span></strong>Smooth Scrolling</li>
<li><em>(not related to graphic)</em> <strong><span style="color:#008000;">[ON]&nbsp;</span></strong>Enable Encrypted Media Extensions on &lt;video&gt; elements</li>
<li><strong><span style="color:#008000;">[ON]&nbsp;</span></strong>Enable CSS Shaders</li>
<li><em>(not related to graphic)</em>&nbsp;<strong><span style="color:#008000;">[ON]&nbsp;</span></strong>Web Audio Input</li>
</ul>







配置万后点下面的 “Restart” “Relaunch” button 
