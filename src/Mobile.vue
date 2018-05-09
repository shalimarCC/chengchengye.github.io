<template>
  <div id="app">
    <StyleEditor ref="styleEditor" :code="currentStyle"></StyleEditor>
    <ResumeEditor ref="resumeEditor" :markdown="currentMarkdown" :enableHtml="enableHtml"></ResumeEditor>
  </div>
</template>

<script>
  import StyleEditor from './components/StyleEditor'
  import ResumeEditor from './components/ResumeEditor'
  import './assets/reset.css'

  export default {
    name: 'app',
    components: {
      StyleEditor,
      ResumeEditor
    },
    data() {
      return {
        interval: 10,
        currentStyle: '',
        enableHtml: false,
        fullStyle: [
          `/*
* Inspired by http://strml.net/
* 大家好，我是南方。
* 我来写一份简历！
*/

/* 首先给所有元素加上过渡效果 */
* {
  transition: all .2s;
}
/* 白色背景太单调了，我们来点背景 */
html {
  color: rgb(222,222,222);
  background: rgb(0,43,54);
}
/* 文字离边框太近了 */
.styleEditor {
  padding: .5em;
  border: 1px solid;
  overflow: auto;
  width: 90vw;
  margin: 2.5vh 5vw;
  height: 90vh;
}
/* 太高了 */
.styleEditor {
  height: 45vh;
}
/* 代码高亮 */
.token.selector{
  color: rgb(133,153,0);
}
.token.property{
  color: rgb(187,137,0);
}
.token.punctuation{
  color: yellow;
}
.token.function{
  color: rgb(42,161,152);
}

/* 加点 3D 效果呗 */
html{
  perspective: 1000px;
}
.styleEditor {
  position: fixed; left: 0; top: 0;
  transform: rotateX(-10deg) translateZ(-50px) ;
}

/* 接下来我给自己准备一个编辑器 */
.resumeEditor{
  position: fixed;
  top: 50%; left: 0;
  padding: .5em;  margin: 2.5vh;
  width: 95vw; height: 45vh;
  border: 1px solid;
  background: white; color: #222;
  overflow: auto;
}
/* 好了，我开始写简历了 */


`,
          `
/* 这个简历好像差点什么
 * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
 * 简单，用开源工具翻译成 HTML 就行了
 */
`
          ,
          `
/* 再对 HTML 加点样式 */
.resumeEditor{
  padding: 2em;
}
.resumeEditor h2{
  display: inline-block;
  border-bottom: 1px solid;
  margin: 1em 0 .5em;
}
.resumeEditor ul,.resumeEditor ol{
  list-style: none;
}
.resumeEditor ul> li::before{
  content: '•';
  margin-right: .5em;
}
.resumeEditor ol {
  counter-reset: section;
}
.resumeEditor ol li::before {
  counter-increment: section;
  content: counters(section, ".") " ";
  margin-right: .5em;
}
.resumeEditor blockquote {
  margin: 1em;
  padding: .5em;
  background: #ddd;
}
`],
        currentMarkdown: '',
        fullMarkdown: `南方
====
坐标：湖南长沙。

资深软件工程师，资深产品经理，高级项目经理。现为自由职业。

[下载离线简历](http://www.sitexa.org/anires/static/resume.pdf)

技能
====

数据库设计
----
  - 结构化数据库设计
  - noSQL设计

后端开发
----
  - 用户管理
  - 单点登录
  - 第三方登录
  - 权限管理
  - 交易系统
  - 支付系统
  - 社区系统
  - 博客系统
  - 公众号开发
  - 小程序开发
  - API接口

前端开发
----
  - Web前端开发
  - 移动终端(Native App, Hybrid App)

产品设计
----
  - 智慧旅游项目
  - 运动健康云平台
  - 社区支持农业O2O项目
  - 省级环境监控平台
  - 高速公路异地处罚系统
  - 环保局办公自动化系统
  - 保险公司数据迁移项目
  - 啤酒厂供应链项目
  - 货运代理系统
  - 集装箱管理系统
  - 滞期费管理项目

技术及语言
----
  - Java: SpringMVC, SpringCloud, Hibernate, iBatis, spark, sql2o, HikariCP, freemarker, okHttp, retrofit, RxJava
  - Kotlin: ktor, exposed, anko
  - Node.js: express, angular, ionic, react, cordova, meteor, electron, axios
  - Swift: Vapor, ReactiveSwift
  - Golang: hugo, beego, gorm, sqlx, matcha
  - Python: tushare, pandas, numpy, matplotlib
  - DotNet and PHP
  - DB: SQLServer, Oracle, MySQL/MariaDB, MongoDB, graphQL, redis, memcached
  - WebServer: apache, nginx, tomcat, netty, jetty
  - OS: Ubuntu, CentOS, MacOS, Windows
  - Others: Docker, git, Xmind，Axure

工作经历
====

1. 湖南融耀健康管理有限公司
2. 湖南三英特旅游智能技术有限公司
3. 合肥蓝盾科技有限公司
4. 上海易保网络有限公司
5. 厦门海环计算机软件有限公司

教育经历
====

1. 华东理工大学 环境工程学士
2. 厦门大学 系统工程硕士

文章
====

* [故土难离（我的父亲母亲）](https://www.meipian.cn/qacqfbz?uuid=d541c15eef694065bc9d1ac9a07925a2)
* [油腻腻的中年（小诗）](https://www.meipian.cn/wjaz3zh?uuid=ca1cd053b717451da781786de44e66e7)
* [生命（老四们的蝼蚁人生）](https://www.meipian.cn/vc4pr59?uuid=799c98f5a187405c94c86f7da7788869)
* [大健康商业模式](http://www.sitexa.org/technology/%E5%A4%A7%E5%81%A5%E5%BA%B7%E5%95%86%E4%B8%9A%E6%A8%A1%E5%BC%8F.html)
* [社区社交商业模型](http://www.sitexa.org/other/%E7%A4%BE%E5%8C%BA%E7%A4%BE%E4%BA%A4%E5%95%86%E4%B8%9A%E6%A8%A1%E5%9E%8B.html)

链接
====

* [GitHub](https://github.com/sitexa)
* [技术博客](http://www.sitexa.org)
* [南方时代](http://www.sitexa.net)
* [神秘湘鄂西](http://www.sitexa.cn)

联系方式
====

* 电话：18673107430
* 微信：18673107430
* 邮箱：xnpeng@163.com

离线简历
----

[下载简历](http://www.sitexa.org/anires/static/resume.pdf)

鸣谢
----

* 五一节结束了，我借此页面跟大家说一声感谢。
* 这段时间，我有些诚煌诚恐，无地自容。我的经历都是一些小公司的软件开发，做着做着就成了Team leader，做过架构、产品、管理，做了好几个行业，技术栈全而不深。
* 到底适合做什么岗位，我也不好定位，其实也没得选择。除了美工不会做，其他的都会点。近几年，主要在JVM平台上做开发，特别是自(shi)由(ye)之后，我主要学习了Kotlin和NodeJS相关技术，同时也玩玩Python和GoLang。
* 自认为学习能力强，追求完美，不管是商业模式，还是产品设计，或者技术架构，以及代码开发，都追求优美。但都被残酷的现实挤压得很骨感。
* 一直以来，我对社交和电商很感兴趣，伴随着QQ和微信的成长、体验着阿里和京东的发展，见证了美团和大众点评的成功，思考过Facebook、twitter、YouTube、Snapchat、Whatsapp、Medium为什么在国外能够斗争发展，对一些新模式新技术比如共享单车、区块链有些关注，因为自由嘛，不受约束地接触各种技术（玩具）。
* 在社交领域，腾讯独霸天下20年，在电商领域，毫无疑问，是阿里的天下，虽有京东、苏宁等后起之秀，但都没有革命性的模式或产品。美团在团购领域的成功，既迎合了中国消费者的心理，也强化了这种心理。这些公司和老板都是我无比崇拜的IT英雄！
* 社交是一种形式，电商是变现模式，将二者结合起来会是一个什么样子呢？很多探索者已经在理论上和实践上做过很多尝试，有人号称社交电商，我不知对不对。
* 我的思考是这样的，陌生社交和熟人社交之间有一个巨大的中间地带，即半生不熟的社区社交（园区社交），目前QQ群和微信群在承担这个工作，实际上不能满足现实需求。
* 阿里电商（单中心）和微商（无中心）电商之间存在着一个巨大的中间地带，即社区电商（多中心），虽然有很多个创业团队做过多年的尝试，比如小区无忧，社区001，国安社区等等，都投入了大量资金，但我看不到什么革命性的模式。
* 我的想法是用社交带来流量，通过电商变现。我是不是有点异想天开？
* 有很多企业向我发出了面试邀请，有很多创业团队向我伸出了橄榄枝，一些朋友给我提出非常好的建议，还有很多同行同学们希望跟我进行技术交流，甚至有些企业问我能否承接外包业务。
* 在此，我要对所有的所有，说一声谢谢，谢谢你们对我的关心和支持！有你们的存在，让我对明天充满希望，对未来充满信心！不管有没有找到合适的工作，我认识了一群朋友，我非常满意！
* 我回复了一些朋友的信息，还有很多朋友的信息我没能及时回复，在此，我表示深深的歉意！


感谢名单（不完全）
----

- 北京肿瘤康复会
- 珠海紫鸳无人机
- 腾讯大燕网
- 广州游戏团队JacobyTong
- 长沙领路教育
- 京东项目组
- 北京拉勾网
- 北京神策大数据
- 深圳珍爱网
- 北京途家(类似airbnb 项目)
- 北京嘉楠捷思区块链
- 成都muslog(玩音乐)团队
- 深圳某游戏公司
- 广州某游戏公司
- 上海某广告公司
- 中通快运
- 今日头条
- 福州肆壹壹科技
- 河南某科技公司
- 青岛某智能电视公司
- 上海某直播公司
- 衡阳某广告公司(腾讯广告)
- 上海某芯片公司
- 长沙某机械公司
- 北京美甲帮
- 深圳某新零售公司
- 阿里钉钉
- 搜狗推广
- 苏州某互联网公司
- 北京中华万年历
- 上海优客工场
- 长沙超G名片
- 上海化时信息技术
- 长沙快智科技
- 长沙机械之家
- 长沙奥联
- 广州神马优选
- 上海复星集团
- 北京永洪科技
- 个推公司
- 安徽国药医疗科技
- 昆山某区块链公司
- 中山某文化传媒公司
- 脉脉公司
- 深圳声博士
- 北京亲见
- 奇点金服
- 米柚生活
- 大众点评
- 邯郸某农产品电商公司
- 图灵出版
- 北京牛顿区块链
- 深圳际客国际
- 某智慧旅游公司
- 厦大粤港澳青创会
- 北汽集团
- 成都某社交产品
- 北京swie.io工业4.0
- 掘金团队
- 饿了么华南地区
- 世联行
- 阿里电商SaaS平台
- 上海fordeal出海电商
- 北京某互联网保险
- 上海艾比特
- 北京船运帮
- 蚂蚁金服
- 上海高校配餐
- 有赞商城
- 上海airwallex
- 上海唯柚商城
- 京东某项目
- 北京海唐新媒
- 上海好贷网
- 北京弥财
- 广州某区块链和人工智能团队
- 云鸟科技

`
      }
    },
    created() {
      this.makeResume()
    },

    methods: {
      makeResume: async function () {
        await this.progressivelyShowStyle(0)
        await this.progressivelyShowResume()
        await this.progressivelyShowStyle(1)
        await this.showHtml()
        await this.progressivelyShowStyle(2)
      },
      showHtml: function () {
        return new Promise((resolve, reject) => {
          this.enableHtml = true
          this.$nextTick(() => {
            this.$refs.resumeEditor.goTop()
          })
          resolve()
        })
      },
      progressivelyShowStyle(n) {
        return new Promise((resolve, reject) => {
          let interval = this.interval
          let showStyle = (async function () {
            let style = this.fullStyle[n]
            if (!style) { return }
            // 计算前 n 个 style 的字符总数
            let length = this.fullStyle.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0)
            let prefixLength = length - style.length
            if (this.currentStyle.length < length) {
              let l = this.currentStyle.length - prefixLength
              let char = style.substring(l, l + 1) || ' '
              this.currentStyle += char
              if (style.substring(l - 1, l) === '\n' && this.$refs.styleEditor) {
                this.$nextTick(() => {
                  this.$refs.styleEditor.goBottom()
                })
              }
              setTimeout(showStyle, interval)
            } else {
              resolve()
            }
          }).bind(this)
          showStyle()
        })
      },
      progressivelyShowResume() {
        return new Promise((resolve, reject) => {
          let length = this.fullMarkdown.length
          let interval = this.interval
          let showResume = () => {
            if (this.currentMarkdown.length < length) {
              this.currentMarkdown = this.fullMarkdown.substring(0, this.currentMarkdown.length + 1)
              let lastChar = this.currentMarkdown[this.currentMarkdown.length - 1]
              let prevChar = this.currentMarkdown[this.currentMarkdown.length - 2]
              if (prevChar === '\n' && this.$refs.resumeEditor) {
                this.$nextTick(() => this.$refs.resumeEditor.goBottom())
              }
              setTimeout(showResume, interval)
            } else {
              resolve()
            }
          }
          showResume()
        })
      }
    }
  }

</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh; position: relative;
  }

  html {
    min-height: 100vh;
  }
  *{
    box-sizing: border-box;
  }

</style>
