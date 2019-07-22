<template>
  <div id="index">
    <van-nav-bar title="数据中心" left-text left-arrow />
    <van-grid :column-num="3">
      <van-grid-item icon="friends-o" text="新用户统计" to="/NewUserStatistics" />
      <van-grid-item icon="chart-trending-o" text="用户活跃度统计" to="/Activity" />
      <van-grid-item icon="apps-o" text="应用点击量统计" to="/AppData" />
    </van-grid>
    <div class="load" v-if="show">
      <van-loading color="#fff" size='40px' type="spinner" />
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      show: false
    };
  },
  mounted() {
    if (this.$store.state.username == "") {
      this.show=true
      this.$store.commit("saveNAME", this.$utils.getUrlKey("username")); //teac_20298
      this.$axios
        .get(
          "/api/zone/phone/ckcheckininfo/getUserTypes?userId=" +
            this.$utils.getUrlKey("username")
        )
        .then(response => {
          //this.$store.commit('saveTYPE',response.data.userType)
          this.$store.commit("saveTYPE", "area"); //city市管理员，area:区管理员，school校管理员，teacher是教师,userTYpe=Guardian 即为家长，Student是学生角色
          // this.$store.commit('saveID',response.data.orgId)
          this.$store.commit("saveID", "jy320399"); //市：jy320300开发区jy320399大黄山实小s_1
          this.show = false;
          console.log(
            "首页返回成功：手动改变角色为area，单位id为jy320399：开发区"
          );
        });
    }
  }
};
</script>

<style>
#index .van-grid-item .van-grid-item__content {
  padding: 10px 0 30px;
}
#index .van-grid-item .van-icon {
  font-size: 40px;
  padding: 16px 0 10px;
}
#index .van-grid-item .van-grid-item__text {
  font-size: 14px;
}
#index .van-grid-item:nth-child(1) .van-icon {
  color: #02ba50;
}
#index .van-grid-item:nth-child(2) .van-icon {
  color: #ff8401;
}
#index .van-grid-item:nth-child(3) .van-icon {
  color: #0098fe;
}
.load {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
}
.load .van-loading {
  text-align: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    height: 60px;
    line-height: 60px;
}
</style>