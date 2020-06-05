<template>
  <div id="app">
    <router-view />
    <div class="footer">
      <div calss="item">Copyright © 2018 - 2020 Nikoni. All Rights Reserved.</div>
      <div class="item">
        <a target="_blank" href="http://beian.miit.gov.cn/">粤ICP备18079097号</a>
      </div>
      <!--
      <div class="item">
        <img src="http://www.gdtv.cn/f/images/beian.png">
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602004922" target="_blank">工信部:粤ICP备18079097号-1</a>
      </div>
      -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
.footer{
  padding: 10px 0;
  width: 100%;
  position: fixed;
  // flex-direction: column;
  bottom: 0;
  color: #888;
  
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #eee;
  background: #fff;
}
.footer .item{
  font-size: 14px;
  margin: 0 50px;
}
</style>