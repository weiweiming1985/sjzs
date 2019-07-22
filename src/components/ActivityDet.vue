<template>
  <div id="activitydet">
    <van-nav-bar title="用户活跃度" left-text left-arrow @click-left="onClickLeft" />
    <div class="main">
      <div class="mb1">
        <table class="hyd">
          <tr class="bt">
            <th width="20%">时间</th>
            <th width="20%">机构人员(次)</th>
            <th width="20%">教师(次)</th>
            <th width="20%">学生/家长(次)</th>
            <th width="20%">总计(次)</th>
          </tr>
          <tr v-for="(sj,index) in sjs" :key="index">
            <td>{{sj.datestr.substr(5,5)}}</td>
            <td>{{sj.exect}}</td>
            <td>{{sj.teact}}</td>
            <td>{{sj.gsct}}</td>
            <td>{{sj.totalct}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "activitydet",
  data() {
    return {
      sjs:''
    };
  },
  mounted() {
    console.log("/api/zone/phone/biuseractivity/getUseractData?page=0&limi=0&accessRegionId="+this.$route.params.orgId+"&accessSchoolId="+this.$route.params.accessSchoolId+"&startdate="+this.$route.params.start_time+"&enddate="+this.$route.params.end_time)
    
    this.$axios
      .get(
        "/api/zone/phone/biuseractivity/getUseractData?page=0&limi=0&accessRegionId="+this.$route.params.orgId+"&accessSchoolId="+this.$route.params.accessSchoolId+"&startdate="+this.$route.params.start_time+"&enddate="+this.$route.params.end_time
      )
      .then(response => {
        this.sjs=response.data.data
      });
  },
  methods:{
    onClickLeft(){
      this.$router.push({path:'/Activity'})
    }
  }
};
</script>

<style>
table {
  width: 100%;
  empty-cells: show;
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 14px;
}
table th {
  font-weight: normal;
}
table td {
  color: #333;
}
table.hyd .bt {
  background-color: #cdebff;
}
table.hyd tr {
  height: 50px;
  border-bottom: 1px solid #eee;
}
table.hyd td {
  text-align: center;
}
</style>