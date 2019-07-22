<template>
  <div id="newuserstatisticsdet">
      <van-nav-bar title="新用户注册" left-text left-arrow @click-left="onClickLeft" />
    <div class="main">
      <div class="mb lm1">
        <ul>
          <li>
            <h3>{{xzsj}}</h3>
            <span>今日新增(人)</span>
          </li>
          <li>
            <h3>{{zjsj}}</h3>
            <span>用户总计(人)</span>
          </li>
        </ul>
      </div>
      <router-view/>
    </div>
      <div class="mb lm2">
          <table class="xyh">
              <tr class="bt">
                  <th width=29%>时间</th>
                  <th width=22%>新用户(人)</th>
                  <th width=22%>新用户占比</th>
                  <th width=27%>总计用户(人)</th>
              </tr>
              <tr v-for="(sj,index) in sjs" :key="index">
                  <td>{{sj.datetimes.substr(5,5)}}</td>
                  <td>{{sj.newregct}}</td>
                  <td>{{sj.newregct/sj.totalct+'%'}}</td>
                  <td>{{sj.totalct}}</td>
              </tr>
          </table>
      </div>
  </div>
</template>

<script>
export default {
  name: 'newuserstatisticsdet',
  data() {
    return {
      sjs:'',
      xzsj: "",
      zjsj: ""
    };
  },
  mounted() {
    console.log("/api/zone/phone/biuseractivity/getUseractData?page=0&limi=0&accessRegionId="+this.$route.params.orgId+"&accessSchoolId="+this.$route.params.accessSchoolId+"&startdate="+this.$route.params.start_time+"&enddate="+this.$route.params.end_time)
    
    this.$axios
      .get(
        "/api/zone/phone/biuseractivity/getNewUserData?page=0&limi=0&accessRegionId="+this.$route.params.orgId+"&accessSchoolId="+this.$route.params.accessSchoolId+"&startdate="+this.$route.params.start_time+"&enddate="+this.$route.params.end_time
      )
      .then(response => {
        this.sjs=response.data.data
        this.xzsj=response.data.newUserCount
        this.zjsj=response.data.allUserCount
      });
  },
  methods:{
    onClickLeft(){
      this.$router.push({path:'/NewUserStatistics'})
    }
  }
}
</script>

<style>
#newuserstatisticsdet .main{padding: 10px;}
#newuserstatisticsdet .lm1 {
  padding: 25px 0;
  box-sizing: border-box;
  overflow: hidden;
}
#newuserstatisticsdet .lm1 li {
  float: left;
  width: 50%;
  box-sizing: border-box;
}
#newuserstatisticsdet .lm1 li:nth-child(1) {
  border-right: solid 1px #cdd9ed;
}
#newuserstatisticsdet .lm1 li h3 {
  font-size: 30px;
  color: #0182dc;
  font-weight: normal;
  padding: 0;
  margin: 0;
  display: block;
  text-align: center;
}
#newuserstatisticsdet .lm1 li span {
  font-size: 16px;
  color: #333;
  font-weight: normal;
  padding: 0;
  margin: 0;
  display: block;
  text-align: center;
}
table{width:100%;empty-cells:show;background-color:transparent;border-collapse:collapse;border-spacing:0;font-size: 14px;}
table th{font-weight: normal;}
table td{color: #333;}
table.xyh .bt{background-color: #cdebff;}
table.xyh tr{height: 50px;border-bottom: 1px solid #eee;}
table.xyh td{text-align: center;}

</style>