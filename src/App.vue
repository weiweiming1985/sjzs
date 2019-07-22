<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
.van-nav-bar {
  background: linear-gradient(to right, #00c8d0, #0096fe);
}
.van-nav-bar .van-icon {
  color: #fff;
}
.van-nav-bar__title {
  color: #fff;
}
.van-nav-bar__text {
  color: #fff;
}
.main {
  background-color: #f3f3f3;
}
.mb {
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 10px;
  overflow: hidden;
}
.time {
  text-align: center;
  font-size: 14px;
  color: #999;
}
.van-cell-group {
  display: inline-block;
  width: 39%;
  margin: 0 10px;
  border: solid 1px #eaedf2;
  font-size: 16px;
}
.van-field__control {
  text-align: center;
}
.van-nav-bar__text:active {
  background-color: transparent;
}
.van-cell-group {
  border-radius: 6px;
}
.van-cell {
  padding: 6px 10px;
}
.tishi {
  background: transparent;
  color: #fff;
}
.xxxx {
  width: 80%;
  left: 10%;
  border-left: none;
  margin: 30px 0;
  border-right: none;
}
</style>