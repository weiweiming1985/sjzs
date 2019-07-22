<template>
  <div id="appdatadet">
    <van-nav-bar title="应用排名统计" left-text left-arrow @click-left="onClickLeft" />
    <div class="main">
        <div class="mb1">
      <table class="yyxq">
              <tr class="bt">
                  <th width=20%>应用名称</th>
                  <th width=20%>机构人员(次)</th>
                  <th width=20%>教师(次)</th>
                  <th width=20%>学生/家长(次)</th>
                  <th width=20%>总计(次)</th>
              </tr>
              <tr v-for="(sj,index) in sjs" :key="index">
                  <td>{{sj.CLIENT_NAME}}</td>
                  <td>{{sj.totalect}}</td>
                  <td>{{sj.totaltct}}</td>
                  <td>{{sj.totalgct}}</td>
                  <td>{{sj.totalct}}</td>
              </tr>
              
          </table>
          </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "appdatadet",
  data() {
    return {
      sjs:''
    };
  },
  mounted() {
    // console.log("/api/zone/phone/biapplicationusage/getApplicationUsageData?page=0&limi=0&accessRegionId="+this.$route.params.orgId+"&userType="+this.$route.params.userType+"&accessSchoolId="+this.$route.params.accessSchoolId+"&startdate="+this.$route.params.start_time+"&enddate="+this.$route.params.end_time)
    this.$axios
      .get(
        "/api/zone/phone/biapplicationusage/getApplicationUsageData?page=0&limi=0&accessRegionId="+this.$route.params.orgId+"&userType="+this.$route.params.userType+"&accessSchoolId="+this.$route.params.accessSchoolId+"&startdate="+this.$route.params.start_time+"&enddate="+this.$route.params.end_time
      )
      .then(response => {
        this.sjs=response.data.data
      });
  },
  methods:{
    onClickLeft(){
      this.$router.push({path:'/AppData'})
    }
  }
};
</script>

<style>
#appdatadet .mb1 {
  background-color: #fff;
}
table{width:100%;empty-cells:show;background-color:transparent;border-collapse:collapse;border-spacing:0;font-size: 14px;}
table th{font-weight: normal;}
table td{color: #333;}
table.yyxq .bt{background-color: #cdebff;}
table.yyxq tr{height: 50px;border-bottom: 1px solid #eee;}
table.yyxq td{text-align: center;}
</style>