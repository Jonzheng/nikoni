<template>
  <div class="app-container">

  <!---->

<article data-v-7407bc26="" itemscope="itemscope" itemtype="http://schema.org/Article" class="article" data-v-23c7d456=""><meta itemprop="url" content="https://juejin.im/post/5d07cf13f265da1bd522cfb6"><meta itemprop="headline" content="CentOS安装MySQL详解">
<meta itemprop="keywords" content="MySQL"><meta itemprop="datePublished" content="2019-06-17T17:44:49.635Z">
<meta itemprop="image" content="https://b-gold-cdn.xitu.io/icon/icon-128.png"><div itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person"><meta itemprop="name" content="tianranll"><meta itemprop="url" content="https://juejin.im/user/5cdf70bce51d451086151d23"></div><div itemprop="publisher" itemscope="itemscope" itemtype="http://schema.org/Organization"><meta itemprop="name" content="掘金"><div itemprop="logo" itemscope="itemscope" itemtype="https://schema.org/ImageObject"><meta itemprop="url" content="https://b-gold-cdn.xitu.io/icon/icon-white-180.png"><meta itemprop="width" content="180"><meta itemprop="height" content="180"></div></div><div data-v-7407bc26="" class="author-info-block"><a data-v-7407bc26="" href="/user/5cdf70bce51d451086151d23" target="_blank" rel="" class="avatar-link"><div data-v-292b3648="" data-v-11331c20="" data-v-7407bc26="" data-src="https://user-gold-cdn.xitu.io/2019/5/23/16ae4e55897de553?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1" class="lazy avatar avatar loaded" style="background-image: url(&quot;https://user-gold-cdn.xitu.io/2019/5/23/16ae4e55897de553?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1&quot;);"></div></a><div data-v-7407bc26="" class="author-info-box"><a data-v-44e95489="" data-v-7407bc26="" href="/user/5cdf70bce51d451086151d23" target="_blank" rel="" class="username username ellipsis">tianranll<a data-v-00e1e43c="" data-v-44e95489="" href="/book/5c90640c5188252d7941f5bb/section/5c9065385188252da6320022" target="_blank" rel="" class="rank"><img data-v-00e1e43c="" src="https://b-gold-cdn.xitu.io/v3/static/img/lv-2.f597b88.svg" alt="lv-2"></a></a><div data-v-7407bc26="" class="meta-box"><time data-v-7407bc26="" datetime="2019-06-17T17:44:49.635Z" title="Tue Jun 18 2019 01:44:49 GMT+0800 (中国标准时间)" class="time">2019年06月18日</time><span data-v-7407bc26="" class="views-count">阅读 10136</span><!----></div></div><button data-v-fa88a374="" data-v-7407bc26="" class="follow-button follow">关注</button></div><!----><h1 data-v-7407bc26="" class="article-title">CentOS安装MySQL详解</h1><div data-v-7407bc26="" data-id="5d07d191f265da1bb27731bd" itemprop="articleBody" class="article-content"><h2 class="heading" data-id="heading-0">引言</h2>
<p>最近某云搞活动，买了个服务器作为平时学习和测试用，新机器啥也没有，一些常用软件的安装是免不了的，于是乎想着把安装过程都详细记录下来，一是做个备忘，二是给有需要的同学作个参考。</p>
<p>Linux上安装软件常见的几种方式：</p>
<ul>
<li>源码编译</li>
<li>压缩包解压（一般为tar.gz）</li>
<li>编译好的安装包（RPM、DPKG等）</li>
<li>在线安装（YUM、APT等）</li>
</ul>
<p>以上几种方式便捷性依次增加，但通用性依次下降，比如直接下载压缩包进行解压，这种方式一般需要自己做一些额外的配置工作，但只要掌握了方法，各个平台基本都适用，YUM虽然简单，但是平台受限，网络受限，必要的时候还需要增加一些特定YUM源。</p>
<p>几种安装方式最好都能掌握，原则上能用简单的就用简单的：YUM&gt;RPM&gt;tar.gz&gt;源码</p>
<p>本文是介绍MySQL在CentOS上的安装，主要步骤都是参考了MySQL官方文档：<a target="_blank" href="https://dev.mysql.com/doc/refman/5.7/en/installing.html" rel="nofollow noopener noreferrer">dev.mysql.com/doc/refman/…</a></p>
<p>为了测试不同安装方式，反复折腾了好几次，装了删，删了装，每个步骤都是亲测成功的，每条命令都是亲自执行过的，可以放心使用</p>
<p>咱们闲话少说，书归正传（这闲话就不少了...）</p>
<h2 class="heading" data-id="heading-1">一、YUM</h2>
<h4 class="heading" data-id="heading-2">0、删除已安装的MySQL</h4>
<h5 class="heading" data-id="heading-3">检查MariaDB</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; rpm -qa|grep mariadb
mariadb-server-5.5.60-1.el7_5.x86_64
mariadb-5.5.60-1.el7_5.x86_64
mariadb-libs-5.5.60-1.el7_5.x86_64
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-4">删除mariadb</h5>
<p>如果不存在（上面检查结果返回空）则跳过步骤</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; rpm <span class="hljs-_">-e</span> --nodeps mariadb-server
shell&gt; rpm <span class="hljs-_">-e</span> --nodeps mariadb
shell&gt; rpm <span class="hljs-_">-e</span> --nodeps mariadb-libs
<span class="copy-code-btn">复制代码</span></code></pre><p><em>其实yum方式安装是可以不用删除mariadb的，安装MySQL会覆盖掉之前已存在的mariadb</em></p>
<h5 class="heading" data-id="heading-5">检查MySQL</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; rpm -qa|grep mysql
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-6">删除MySQL</h5>
<p>如果不存在（上面检查结果返回空）则跳过步骤</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; rpm <span class="hljs-_">-e</span> --nodeps xxx
<span class="copy-code-btn">复制代码</span></code></pre><h3 class="heading" data-id="heading-7">1、添加MySQL Yum Repository</h3>
<blockquote>
<p>从CentOS 7开始，MariaDB成为Yum源中默认的数据库安装包。也就是说在CentOS 7及以上的系统中使用yum安装MySQL默认安装的会是MariaDB（MySQL的一个分支）。如果想安装官方MySQL版本，需要使用MySQL提供的Yum源。</p>
</blockquote>
<h5 class="heading" data-id="heading-8">下载MySQL源</h5>
<p>官网地址：<a target="_blank" href="https://dev.mysql.com/downloads/repo/yum/" rel="nofollow noopener noreferrer">dev.mysql.com/downloads/r…</a></p>
<p>查看系统版本：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; cat /etc/redhat-release
CentOS Linux release 7.6.1810 (Core)
<span class="copy-code-btn">复制代码</span></code></pre><p>选择对应的版本进行下载，例如CentOS 7当前在官网查看最新Yum源的下载地址为：
<a target="_blank" href="https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm" rel="nofollow noopener noreferrer">dev.mysql.com/get/mysql80…</a></p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-9">安装MySQL源</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo rpm -Uvh platform-and-version-specific-package-name.rpm
<span class="copy-code-btn">复制代码</span></code></pre><p>例如CentOS7当前最新MySQL源安装：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo rpm -Uvh mysql80-community-release-el7-3.noarch.rpm
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-10">检查是否安装成功</h5>
<p>执行成功后会在<code>/etc/yum.repos.d/</code>目录下生成两个repo文件<code>mysql-community.repo</code>及 <code>mysql-community-source.repo</code></p>
<p>并且通过<code>yum repolist</code>可以看到mysql相关资源</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; yum repolist enabled | grep <span class="hljs-string">"mysql.*-community.*"</span>
!mysql-connectors-community/x86_64 MySQL Connectors Community                108
!mysql-tools-community/x86_64      MySQL Tools Community                      90
!mysql80-community/x86_64          MySQL 8.0 Community Server                113
<span class="copy-code-btn">复制代码</span></code></pre><h3 class="heading" data-id="heading-11">2、选择MySQL版本</h3>
<p>使用MySQL Yum Repository安装MySQL，默认会选择当前最新的稳定版本，例如通过上面的MySQL源进行安装的话，默安装会选择MySQL 8.0版本，如果就是想要安装该版本，可以直接跳过此步骤，如果不是，比如我这里希望安装MySQL5.7版本，就需要“切换一下版本”：</p>
<h5 class="heading" data-id="heading-12">查看当前MySQL Yum Repository中所有MySQL版本（每个版本在不同的子仓库中）</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; yum repolist all | grep mysql
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-13">切换版本</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo yum-config-manager --disable mysql80-community
shell&gt; sudo yum-config-manager --enable mysql57-community
<span class="copy-code-btn">复制代码</span></code></pre><p>除了使用yum-config-manager之外，还可以直接编辑<code>/etc/yum.repos.d/mysql-community.repo</code>文件</p>
<p>enabled=0禁用</p>
<pre><code class="hljs bash copyable" lang="bash">[mysql80-community]
name=MySQL 8.0 Community Server
baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/7/<span class="hljs-variable">$basearch</span>/
enabled=0
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
<span class="copy-code-btn">复制代码</span></code></pre><p>enabled=1启用</p>
<pre><code class="hljs bash copyable" lang="bash"><span class="hljs-comment"># Enable to use MySQL 5.7</span>
[mysql57-community]
name=MySQL 5.7 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/7/<span class="hljs-variable">$basearch</span>/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-14">检查当前启用的MySQL仓库</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; yum repolist enabled | grep mysql
<span class="copy-code-btn">复制代码</span></code></pre><p><em>如果同时启用了多个仓库，安装时会选择最新版本</em></p>
<h3 class="heading" data-id="heading-15">3、安装MySQL</h3>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo yum install mysql-community-server
<span class="copy-code-btn">复制代码</span></code></pre><p>该命令会安装MySQL服务器 (mysql-community-server) 及其所需的依赖、相关组件，包括mysql-community-client、mysql-community-common、mysql-community-libs等</p>
<p>如果带宽不够，这个步骤时间会比较长，请耐心等待~</p>
<h3 class="heading" data-id="heading-16">4、启动MySQL</h3>
<h5 class="heading" data-id="heading-17">启动</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo systemctl start mysqld.service
<span class="copy-code-btn">复制代码</span></code></pre><p>CentOS 6：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo service mysqld start
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-18">查看状态</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo systemctl status mysqld.service
<span class="copy-code-btn">复制代码</span></code></pre><p>CentOS 6：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo service mysqld status
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-19">停止</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo systemctl stop mysqld.service
<span class="copy-code-btn">复制代码</span></code></pre><p>CentOS 6：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo service mysqld stop
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-20">重启</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo systemctl restart mysqld.service
<span class="copy-code-btn">复制代码</span></code></pre><p>CentOS 6：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo service mysqld restart
<span class="copy-code-btn">复制代码</span></code></pre><h3 class="heading" data-id="heading-21">5、修改密码</h3>
<h5 class="heading" data-id="heading-22">初始密码</h5>
<p>MySQL第一次启动后会创建超级管理员账号<code>root@localhost</code>，初始密码存储在日志文件中：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; sudo grep <span class="hljs-string">'temporary password'</span> /var/<span class="hljs-built_in">log</span>/mysqld.log
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-23">修改默认密码</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; mysql -uroot -p
<span class="copy-code-btn">复制代码</span></code></pre><pre><code class="hljs bash copyable" lang="bash">mysql&gt; ALTER USER <span class="hljs-string">'root'</span>@<span class="hljs-string">'localhost'</span> IDENTIFIED BY <span class="hljs-string">'123456'</span>;
ERROR 1819 (HY000): Your password does not satisfy the current policy requirements
<span class="copy-code-btn">复制代码</span></code></pre><p>出现上面的提示是因为密码太简单了，解决方法如下：</p>
<ol>
<li>使用复杂密码，MySQL默认的密码策略是要包含数字、字母及特殊字符；</li>
<li>如果只是测试用，不想用那么复杂的密码，可以修改默认策略，即<code>validate_password_policy</code>（以及<code>validate_password_length</code>等相关参数），使其支持简单密码的设定，具体方法可以自行百度；</li>
<li>修改配置文件<code>/etc/my.cnf</code>，添加<code>validate_password=OFF</code>，保存并重启MySQL</li>
</ol>
<pre><code class="hljs bash copyable" lang="bash">mysql&gt; ALTER USER <span class="hljs-string">'root'</span>@<span class="hljs-string">'localhost'</span> IDENTIFIED BY <span class="hljs-string">'123456'</span>;
Query OK, 0 rows affected (0.00 sec)
<span class="copy-code-btn">复制代码</span></code></pre><h3 class="heading" data-id="heading-24">6、允许root远程访问</h3>
<pre><code class="hljs bash copyable" lang="bash">mysql&gt; GRANT ALL PRIVILEGES ON *.* TO <span class="hljs-string">'root'</span>@<span class="hljs-string">'%'</span> IDENTIFIED BY <span class="hljs-string">'123456'</span> WITH GRANT OPTION;
mysql&gt; FLUSH PRIVILEGES;
<span class="copy-code-btn">复制代码</span></code></pre><h3 class="heading" data-id="heading-25">7、设置编码为utf8</h3>
<h5 class="heading" data-id="heading-26">查看编码</h5>
<pre><code class="hljs bash copyable" lang="bash">mysql&gt; SHOW VARIABLES LIKE <span class="hljs-string">'character%'</span>;
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-27">设置编码</h5>
<p>编辑/etc/my.cnf，[mysqld]节点增加以下代码：</p>
<pre><code class="hljs bash copyable" lang="bash">[mysqld]
character_set_server=utf8
init-connect=<span class="hljs-string">'SET NAMES utf8'</span>
<span class="copy-code-btn">复制代码</span></code></pre><h3 class="heading" data-id="heading-28">8、设置开机启动</h3>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; systemctl <span class="hljs-built_in">enable</span> mysqld
shell&gt; systemctl daemon-reload
<span class="copy-code-btn">复制代码</span></code></pre><h2 class="heading" data-id="heading-29">二、RPM</h2>
<blockquote>
<p>除安装过程外，其他步骤和yum方式安装相同，不再赘述</p>
</blockquote>
<h3 class="heading" data-id="heading-30">0、删除已旧版本</h3>
<p>略</p>
<h3 class="heading" data-id="heading-31">1、下载MySQL安装包</h3>
<p>下载地址：<a target="_blank" href="https://dev.mysql.com/downloads/mysql/" rel="nofollow noopener noreferrer">dev.mysql.com/downloads/m…</a></p>
<p>选择对应的版本：
</p><figure><img class="lazyload inited" data-src="https://user-gold-cdn.xitu.io/2019/6/18/16b66894c80e9b32?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" data-width="1280" data-height="804" src="data:image/svg+xml;utf8,<?xml version=&quot;1.0&quot;?><svg xmlns=&quot;http://www.w3.org/2000/svg&quot; version=&quot;1.1&quot; width=&quot;1280&quot; height=&quot;804&quot;></svg>"><figcaption></figcaption></figure><p></p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar
<span class="copy-code-btn">复制代码</span></code></pre><h3 class="heading" data-id="heading-32">2、安装MySQL</h3>
<h5 class="heading" data-id="heading-33">解压（解打包）</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; tar -xvf mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar
tar -xvf mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar
mysql-community-embedded-devel-5.7.26-1.el7.x86_64.rpm
mysql-community-libs-5.7.26-1.el7.x86_64.rpm
mysql-community-embedded-5.7.26-1.el7.x86_64.rpm
mysql-community-test-5.7.26-1.el7.x86_64.rpm
mysql-community-embedded-compat-5.7.26-1.el7.x86_64.rpm
mysql-community-common-5.7.26-1.el7.x86_64.rpm
mysql-community-devel-5.7.26-1.el7.x86_64.rpm
mysql-community-client-5.7.26-1.el7.x86_64.rpm
mysql-community-server-5.7.26-1.el7.x86_64.rpm
<span class="copy-code-btn">复制代码</span></code></pre><p>我们主要安装的是这四个（如果有需要也可以一并安装其它的）：</p>
<pre><code class="hljs bash copyable" lang="bash">mysql-community-libs-5.7.26-1.el7.x86_64.rpm
mysql-community-common-5.7.26-1.el7.x86_64.rpm
mysql-community-client-5.7.26-1.el7.x86_64.rpm
mysql-community-server-5.7.26-1.el7.x86_64.rpm
<span class="copy-code-btn">复制代码</span></code></pre><p>如果不想下载rpm-bundle，官网也提供单独的rpm下载链接</p>
<h5 class="heading" data-id="heading-34">安装</h5>
<p>各rpm包是有依赖关系的，所以需要按照一定顺序进行安装，安装期间如果提示缺少哪些依赖也要先安装相应的包：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; rpm -ivh mysql-community-common-5.7.26-1.el7.x86_64.rpm
shell&gt; rpm -ivh mysql-community-libs-5.7.26-1.el7.x86_64.rpm
shell&gt; rpm -ivh mysql-community-client-5.7.26-1.el7.x86_64.rpm
shell&gt; rpm -ivh mysql-community-server-5.7.26-1.el7.x86_64.rpm
<span class="copy-code-btn">复制代码</span></code></pre><p>还有一种简单的方式，可以自动处理各个包之间的依赖关系并自动下载缺少的依赖：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; yum install mysql-community-{server,client,common,libs}-*
<span class="copy-code-btn">复制代码</span></code></pre><p><em>注意：上面的<code>yum install</code>命令需要在tar解压之后的各个rpm包所在目录内执行，否则就变成yum方式安装了，需要配置MySQL的yum源并且速度很慢，还要当前机器支持外网访问</em></p>
<h3 class="heading" data-id="heading-35">3、设置</h3>
<p>略</p>
<h2 class="heading" data-id="heading-36">三、tar.gz</h2>
<h3 class="heading" data-id="heading-37">0、删除旧版本</h3>
<p>略</p>
<h3 class="heading" data-id="heading-38">1、下载</h3>
<p>下载地址：<a target="_blank" href="https://dev.mysql.com/downloads/mysql/" rel="nofollow noopener noreferrer">dev.mysql.com/downloads/m…</a></p>
<p>选择对应的版本：
</p><figure><img class="lazyload inited" data-src="https://user-gold-cdn.xitu.io/2019/6/18/16b668a1b3c258aa?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" data-width="1280" data-height="420" src="data:image/svg+xml;utf8,<?xml version=&quot;1.0&quot;?><svg xmlns=&quot;http://www.w3.org/2000/svg&quot; version=&quot;1.1&quot; width=&quot;1280&quot; height=&quot;420&quot;></svg>"><figcaption></figcaption></figure><p></p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.26-linux-glibc2.12-x86_64.tar.gz
<span class="copy-code-btn">复制代码</span></code></pre><h3 class="heading" data-id="heading-39">2、安装&amp;配置：</h3>
<h5 class="heading" data-id="heading-40">依赖</h5>
<p>MySQL依赖libaio库，如果没有先安装一下：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; yum install libaio
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-41">创建mysql用户</h5>
<p>不需要登录的一个系统账号，启动MySQL服务时会使用该账号</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; groupadd mysql
shell&gt; useradd -r -g mysql <span class="hljs-_">-s</span> /bin/<span class="hljs-literal">false</span> mysql
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-42">解压并创建链接</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; <span class="hljs-built_in">cd</span> /usr/<span class="hljs-built_in">local</span>
shell&gt; tar zxvf /path/to/mysql-5.7.26-linux-glibc2.12-x86_64.tar.gz
shell&gt; ln <span class="hljs-_">-s</span> mysql-5.7.26-linux-glibc2.12-x86_64/ mysql
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-43">创建mysql-files目录</h5>
<p>这一步并不是必须的，可以设置secure_file_priv的值指向该目录（用于限制数据导入导出操作的目录）</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; <span class="hljs-built_in">cd</span> mysql
shell&gt; mkdir mysql-files
shell&gt; chown mysql:mysql mysql-files
shell&gt; chmod 750 mysql-files
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-44">初始化</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; bin/mysqld --initialize --user=mysql
<span class="copy-code-btn">复制代码</span></code></pre><p>如果初始化时报错如下：</p>
<pre><code class="hljs bash copyable" lang="bash">error <span class="hljs-keyword">while</span> loading shared libraries: libnuma.so.1: cannot open shared object file: No such file or directory
<span class="copy-code-btn">复制代码</span></code></pre><p>是因为libnuma没有安装（或者默认安装的是32位），我们这里需要64位的：</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; yum install numactl.x86_64
<span class="copy-code-btn">复制代码</span></code></pre><p>执行完后重新初始化即可
初始化成功后返回结果中有一行包含初始密码，第一次登录时要用到它：</p>
<pre><code class="hljs bash copyable" lang="bash">A temporary password is generated <span class="hljs-keyword">for</span> root@localhost: 8M0ary878s*U
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-45">启用SSL（非必须）</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; bin/mysql_ssl_rsa_setup
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-46">启动</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; bin/mysqld_safe --user=mysql &amp;
<span class="copy-code-btn">复制代码</span></code></pre><p>查看进程可以看到一些默认参数，可以在配置文件中修改这些参数</p>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; ps -ef | grep mysql
root     14604 12719  0 00:03 pts/0    00:00:00 /bin/sh bin/mysqld_safe --user=mysql
mysql    14674 14604  0 00:03 pts/0    00:00:00 /usr/<span class="hljs-built_in">local</span>/mysql/bin/mysqld --basedir=/usr/<span class="hljs-built_in">local</span>/mysql --datadir=/usr/<span class="hljs-built_in">local</span>/mysql/data --plugin-dir=/usr/<span class="hljs-built_in">local</span>/mysql/lib/plugin --user=mysql --log-error=VM_2_24_centos.err --pid-file=VM_2_24_centos.pid
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-47">设置环境变量</h5>
<p>避免每次执行mysql命令都要加上路径，在<code>/etc/profile</code>中添加：</p>
<pre><code class="hljs bash copyable" lang="bash"><span class="hljs-built_in">export</span> PATH=<span class="hljs-variable">$PATH</span>:/usr/<span class="hljs-built_in">local</span>/mysql/bin
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-48">设置为服务</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; cp support-files/mysql.server /etc/init.d/mysqld
shell&gt; service mysqld start|stop|restart|status
<span class="copy-code-btn">复制代码</span></code></pre><h5 class="heading" data-id="heading-49">开机启动</h5>
<pre><code class="hljs bash copyable" lang="bash">shell&gt; chkconfig --add mysqld
shell&gt; chkconfig --list mysqld
mysqld         	0:关	1:关	2:开	3:开	4:开	5:开	6:关
<span class="copy-code-btn">复制代码</span></code></pre><p><em>其他配置与yum、rpm相同，不再赘述</em></p>
<h2 class="heading" data-id="heading-50">四、源码安装</h2>
<p>就别费这个劲了吧...</p>
<h2 class="heading" data-id="heading-51">结束语</h2>
<p>我们不是Linux运维专家，也不是MySQL专家，生在这个年代也不知算是幸福还是不幸，线上的环境已经越来越少有人（主要指平时写代码的人）手动去搞这些数据库、中间件的安装配置了，为什么呢？因为各种云产品实在是太方便了呀，一般的公司也不会差这几个钱，既方便又稳定，何乐而不为呢~但是我们自己搞一搞用于自己测试还是必要的，而且还有不少公司的开发环境、测试环境偶尔还是需要手动搞一下的，当然，还有那些个自己搞机房的巨头们。</p>
<p>那我们既然不是专家，上面所写的内容如果有纰漏也是在所难免的，如果被看到了还希望能够及时批评指正~</p>
</div></article>


  <!---->
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

