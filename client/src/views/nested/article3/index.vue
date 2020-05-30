<template>
  <div class="dashboard-container">

  <h2 id="layout-bu-ju">
<a href="#" aria-hidden="true" class="header-anchor">¶</a> Layout 布局</h2>
  <p>通过基础的 24 分栏，迅速简便地创建布局。</p>
  <p>通过 row 和 col 组件，并通过 col 组件的 <code>span</code> 属性我们就可以自由地组合布局。</p>
    <div class="box">
      <div class="box-line">
        <el-row>
          <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
        </el-row>
      </div>
      </div>

<h2 id="layout-bu-ju">
<a href="#" aria-hidden="true" class="header-anchor">¶</a>collapse</h2>
    <div class="box">
<div class="asset-content entry-content" id="main-content">

<!-- div class="asset-body" -->
    <p>网页布局（layout）是 CSS 的一个重点应用。</p>
<!-- /div -->

<!-- div id="more" class="asset-more" -->
    <p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071001.gif" alt="" title=""></p>

<p>布局的传统解决方案，基于
<a href="#" target="">盒状模型</a>，依赖 


<a href="#" target=""><code>display</code></a> 属性 + 
<a href="#" target=""><code>position</code></a>属性 + 
<a href="#" target=""><code>float</code></a>属性。它对于那些特殊布局非常不方便，比如，
<a href="#" target="">垂直居中</a>就不容易实现。</p>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071002.png" alt="" title=""></p>
<p>2009年，W3C 提出了一种新的方案----Flex 布局，可以简便、完整、响应式地实现各种页面布局。目前，它已经得到了所有浏览器的支持，这意味着，现在就能很安全地使用这项功能。</p>
<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071003.jpg" alt="" title=""></p>
<p>Flex 布局将成为未来布局的首选方案。本文介绍它的语法，
<a href="#" target="">下一篇文章</a>给出常见布局的 Flex 写法。网友 
<a href="#" target="">JailBreak</a> 为本文的所有示例制作了 
<a href="#" target="">Demo</a>，也可以参考。</p>

<p>以下内容主要参考了下面两篇文章：
<a href="#" target="">A Complete Guide to Flexbox</a> 和 
<a href="#" target="">A Visual Guide to CSS3 Flexbox Properties</a>。</p>
<h2>一、Flex 布局是什么？</h2>
<p>Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。</p>
<p>任何一个容器都可以指定为 Flex 布局。</p>
<blockquote><pre><code class="language-css">
.box{
  display: flex;
}
</code></pre></blockquote>
<p>行内元素也可以使用 Flex 布局。</p>
<blockquote><pre><code class="language-css">
.box{
  display: inline-flex;
}
</code></pre></blockquote>
<p>Webkit 内核的浏览器，必须加上<code>-webkit</code>前缀。</p>
<blockquote><pre><code class="language-css">
.box{
  display: -webkit-flex; /* Safari */
  display: flex;
}
</code></pre></blockquote>

<p>注意，设为 Flex 布局以后，子元素的<code>float</code>、<code>clear</code>和<code>vertical-align</code>属性将失效。</p>
<h2>二、基本概念</h2>
<p>采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。</p>
<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png" alt="" title=""></p>
<p>容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做<code>main start</code>，结束位置叫做<code>main end</code>；交叉轴的开始位置叫做<code>cross start</code>，结束位置叫做<code>cross end</code>。</p>
<p>项目默认沿主轴排列。单个项目占据的主轴空间叫做<code>main size</code>，占据的交叉轴空间叫做<code>cross size</code>。</p>

<h2>三、容器的属性</h2>

<p>以下6个属性设置在容器上。</p>

<blockquote>
  <ul>
<li>flex-direction</li>
<li>flex-wrap</li>
<li>flex-flow</li>
<li>justify-content</li>
<li>align-items</li>
<li>align-content</li>
</ul>
</blockquote>

<h3>3.1 flex-direction属性</h3>

<p><code>flex-direction</code>属性决定主轴的方向（即项目的排列方向）。</p>

<blockquote><pre><code class="language-css">
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
</code></pre></blockquote>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071005.png" alt="" title=""></p>

<p>它可能有4个值。</p>

<blockquote>
  <ul>
<li><code>row</code>（默认值）：主轴为水平方向，起点在左端。</li>
<li><code>row-reverse</code>：主轴为水平方向，起点在右端。</li>
<li><code>column</code>：主轴为垂直方向，起点在上沿。</li>
<li><code>column-reverse</code>：主轴为垂直方向，起点在下沿。</li>
</ul>
</blockquote>

<h3>3.2 flex-wrap属性</h3>

<p>默认情况下，项目都排在一条线（又称"轴线"）上。<code>flex-wrap</code>属性定义，如果一条轴线排不下，如何换行。</p>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071006.png" alt="" title=""></p>

<blockquote><pre><code class="language-css">
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
</code></pre></blockquote>

<p>它可能取三个值。</p>

<p>（1）<code>nowrap</code>（默认）：不换行。</p>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071007.png" alt="" title=""></p>

<p>（2）<code>wrap</code>：换行，第一行在上方。</p>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071008.jpg" alt="" title=""></p>

<p>（3）<code>wrap-reverse</code>：换行，第一行在下方。</p>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071009.jpg" alt="" title=""></p>

<h3>3.3 flex-flow</h3>

<p><code>flex-flow</code>属性是<code>flex-direction</code>属性和<code>flex-wrap</code>属性的简写形式，默认值为<code>row nowrap</code>。</p>

<blockquote><pre><code class="language-css">
.box {
  flex-flow: &lt;flex-direction&gt; || &lt;flex-wrap&gt;;
}
</code></pre></blockquote>

<h3>3.4 justify-content属性</h3>

<p><code>justify-content</code>属性定义了项目在主轴上的对齐方式。</p>

<blockquote><pre><code class="language-css">
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
</code></pre></blockquote>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071010.png" alt="" title=""></p>

<p>它可能取5个值，具体对齐方式与轴的方向有关。下面假设主轴为从左到右。</p>

<blockquote>
  <ul>
<li><code>flex-start</code>（默认值）：左对齐</li>
<li><code>flex-end</code>：右对齐</li>
<li><code>center</code>： 居中</li>
<li><code>space-between</code>：两端对齐，项目之间的间隔都相等。</li>
<li><code>space-around</code>：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。</li>
</ul>
</blockquote>

<h3>3.5 align-items属性</h3>

<p><code>align-items</code>属性定义项目在交叉轴上如何对齐。</p>

<blockquote><pre><code class="language-css">
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
</code></pre></blockquote>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071011.png" alt="" title=""></p>

<p>它可能取5个值。具体的对齐方式与交叉轴的方向有关，下面假设交叉轴从上到下。</p>

<blockquote>
  <ul>
<li><code>flex-start</code>：交叉轴的起点对齐。</li>
<li><code>flex-end</code>：交叉轴的终点对齐。</li>
<li><code>center</code>：交叉轴的中点对齐。</li>
<li><code>baseline</code>: 项目的第一行文字的基线对齐。</li>
<li><code>stretch</code>（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。</li>
</ul>
</blockquote>

<h3>3.6 align-content属性</h3>

<p><code>align-content</code>属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。</p>

<blockquote><pre><code class="language-css">
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
</code></pre></blockquote>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071012.png" alt="" title=""></p>

<p>该属性可能取6个值。</p>

<blockquote>
  <ul>
<li><code>flex-start</code>：与交叉轴的起点对齐。</li>
<li><code>flex-end</code>：与交叉轴的终点对齐。</li>
<li><code>center</code>：与交叉轴的中点对齐。</li>
<li><code>space-between</code>：与交叉轴两端对齐，轴线之间的间隔平均分布。</li>
<li><code>space-around</code>：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。</li>
<li><code>stretch</code>（默认值）：轴线占满整个交叉轴。</li>
</ul>
</blockquote>

<h3>四、项目的属性</h3>

<p>以下6个属性设置在项目上。</p>

<blockquote>
  <ul>
<li><code>order</code></li>
<li><code>flex-grow</code></li>
<li><code>flex-shrink</code></li>
<li><code>flex-basis</code></li>
<li><code>flex</code></li>
<li><code>align-self</code></li>
</ul>
</blockquote>

<h3>4.1 order属性</h3>

<p><code>order</code>属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。</p>

<blockquote><pre><code class="language-css">
.item {
  order: &lt;integer&gt;;
}
</code></pre></blockquote>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071013.png" alt="" title=""></p>

<h3>4.2 flex-grow属性</h3>

<p><code>flex-grow</code>属性定义项目的放大比例，默认为<code>0</code>，即如果存在剩余空间，也不放大。</p>

<blockquote><pre><code class="language-css">
.item {
  flex-grow: &lt;number&gt;; /* default 0 */
}
</code></pre></blockquote>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071014.png" alt="" title=""></p>

<p>如果所有项目的<code>flex-grow</code>属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的<code>flex-grow</code>属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。</p>

<h3>4.3 flex-shrink属性</h3>

<p><code>flex-shrink</code>属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。</p>

<blockquote><pre><code class="language-css">
.item {
  flex-shrink: &lt;number&gt;; /* default 1 */
}
</code></pre></blockquote>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071015.jpg" alt="" title=""></p>

<p>如果所有项目的<code>flex-shrink</code>属性都为1，当空间不足时，都将等比例缩小。如果一个项目的<code>flex-shrink</code>属性为0，其他项目都为1，则空间不足时，前者不缩小。</p>

<p>负值对该属性无效。</p>

<h3>4.4 flex-basis属性</h3>

<p><code>flex-basis</code>属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为<code>auto</code>，即项目的本来大小。</p>

<blockquote><pre><code class="language-css">
.item {
  flex-basis: &lt;length&gt; | auto; /* default auto */
}
</code></pre></blockquote>

<p>它可以设为跟<code>width</code>或<code>height</code>属性一样的值（比如350px），则项目将占据固定空间。</p>

<h3>4.5 flex属性</h3>

<p><code>flex</code>属性是<code>flex-grow</code>, <code>flex-shrink</code> 和 <code>flex-basis</code>的简写，默认值为<code>0 1 auto</code>。后两个属性可选。</p>

<blockquote><pre><code class="language-css">
.item {
  flex: none | [ &lt;'flex-grow'&gt; &lt;'flex-shrink'&gt;? || &lt;'flex-basis'&gt; ]
}
</code></pre></blockquote>

<p>该属性有两个快捷值：<code>auto</code> (<code>1 1 auto</code>) 和 none (<code>0 0 auto</code>)。</p>

<p>建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。</p>

<h3>4.6 align-self属性</h3>

<p><code>align-self</code>属性允许单个项目有与其他项目不一样的对齐方式，可覆盖<code>align-items</code>属性。默认值为<code>auto</code>，表示继承父元素的<code>align-items</code>属性，如果没有父元素，则等同于<code>stretch</code>。</p>

<blockquote><pre><code class="language-css">
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
</code></pre></blockquote>

<p><img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071016.png" alt="" title=""></p>

<p>该属性可能取6个值，除了auto，其他都与align-items属性完全一致。</p>

<p>（完）</p>

      <!-- /div -->

  </div>  
</div>


  <!--
    <div class="dashboard-text">：{{ nickname }}</div>
    <div class="dashboard-text">：{{ date }}</div>
    <el-input v-model="level" placeholder="level" @input="levelInput" />

    <el-button type="primary" @click="yell">测试</el-button>
    <el-button type="primary" @click="getList">查询</el-button>

    <div class="dashboard-container">
      <div class="dashboard-text">：{{ total }}</div>
      <div class="dashboard-text">：{{ list }}</div>
    </div>
  -->
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data: function() {
    return {
    }
  },
}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.btn{
  width: 120px;
  height: 50px;
  border: 1px solid red;
}
.btn:hover{
  background: #999；
}
</style>

<style>
.dashboard-container{
  padding-bottom: 300px;
}
.box{
  margin: 20px 0;
  display: flex;
  align-items: center;
}
.box-line{
  margin: 0 20px;
  width: 50%;
}

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>


<script>
import { mapGetters } from 'vuex'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
     nickname: 'creeper',
      date: '',
      level: 'sr',
      total: 0,
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // getList().then(resp => {
      //   console.log(resp)
      //   this.list = resp.list
      //   this.listLoading = false
      // })
    },
    levelInput(e) {
      console.log(e)
      this.level = e
    },
    yell() {
      hello().then((res) => {
        console.log(res)
        this.nickname = res.nickname
        this.date = res.date
      }).catch((err) => {
        console.log(err)
      })
    },
    getList() {
      this.listLoading = true
      const data = { pageNo: 1, pageSize: 50 }
      data['level'] = this.level
      console.log(data)
      queryList(data).then((res) => {
        console.log(res)
        this.list = res.list
        this.total = res.total
        this.listLoading = false
        setTimeout(() => {
          this.total = 0
        }, 3000)
      }).catch((e) => {
        console.log(e)
        this.listLoading = false
      })
    }
  }
}
</script>

