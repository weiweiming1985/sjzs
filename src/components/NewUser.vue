<template>
  <div id="newuser">
    <van-nav-bar title="新用户注册" left-text right-text="筛选" left-arrow />
    <div class="main">
      <div class="mb lm1">
        <ul>
          <li>
            <h3>500</h3>
            <span>今日新增(人)</span>
          </li>
          <li>
            <h3>1000</h3>
            <span>用户总计(人)</span>
          </li>
        </ul>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "newuser",
  data() {
    return {
     
    };
  }
};
</script>

<style>
#newuser .main{padding: 10px;}
#newuser .lm1 {
  padding: 25px 0;
  box-sizing: border-box;
  overflow: hidden;
}
#newuser .lm1 li {
  float: left;
  width: 50%;
  box-sizing: border-box;
}
#newuser .lm1 li:nth-child(1) {
  border-right: solid 1px #cdd9ed;
}
#newuser .lm1 li h3 {
  font-size: 30px;
  color: #0182dc;
  font-weight: normal;
  padding: 0;
  margin: 0;
  display: block;
  text-align: center;
}
#newuser .lm1 li span {
  font-size: 16px;
  color: #333;
  font-weight: normal;
  padding: 0;
  margin: 0;
  display: block;
  text-align: center;
}
</style>