<template>
  <div id="activity">
    <van-nav-bar
      title="用户活跃度统计"
      left-text
      right-text="筛选"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="main">
      <div class="mb lm1">
        <ul>
          <li>
            <h3>{{xzsj}}</h3>
            <span>今日活跃(人)</span>
          </li>
          <li>
            <h3>{{zjsj}}</h3>
            <span>用户总计(人)</span>
          </li>
        </ul>
      </div>
      <div class="mb lm2">
        <div class="time">
          <van-cell-group>
            <van-field @click="show1 = true" placeholder="请选择开始时间" v-model="starttime" />
          </van-cell-group>至
          <van-cell-group>
            <van-field @click="show2 = true" placeholder="请选择结束时间" v-model="endtime" />
          </van-cell-group>
        </div>
        <div id="myChart1" style="width:97%;height:400px;"></div>
        <van-button class="xxxx" @click="xx" type="default">查看详细信息>></van-button>
      </div>
    </div>
    <van-popup v-model="show1" position="bottom">
      <van-datetime-picker
        v-model="userSelectionTime.start_time"
        type="date"
        :min-date="minDate1"
        :max-date="userSelectionTime.end_time"
        @confirm="confirmPicker1"
      />
    </van-popup>
    <van-popup v-model="show2" position="bottom">
      <van-datetime-picker
        v-model="userSelectionTime.end_time"
        type="date"
        :min-date="userSelectionTime.start_time"
        :max-date="maxDate2"
        @confirm="confirmPicker2"
      />
    </van-popup>
    <van-popup class="tishi" v-model="show">{{tishi}}</van-popup>
  </div>
</template>

<script>
export default {
  name: "activity",
  data() {
    return {
      userId: "", //用户id

      userType: "", //角色
      orgId: "", //区域
      accessSchoolId: "",
      userarr: ["机构人员", "教师", "学生/家长"],

      sjdata: [], //时间数据
      jgdata: [],
      jsdata: [],
      xsjzdata: [],
      xzsj: 0,
      zjsj: 0,
      shaixuanshow: "",
      userSelectionTime: {
        start_time: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
        end_time: new Date()
      },
      show1: false,
      show2: false,
      show: false, //提示弹窗
      tishi: "",
      minDate1: new Date(2017, 10, 1),
      minDate2: new Date(2017, 10, 8),
      maxDate1: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
      maxDate2: new Date()
    };
  },
  computed: {
    starttime: function() {
      return (
        this.userSelectionTime.start_time.getFullYear() +
        "-" +
        (this.userSelectionTime.start_time.getMonth() + 1) +
        "-" +
        this.userSelectionTime.start_time.getDate()
      );
    },
    endtime: function() {
      return (
        this.userSelectionTime.end_time.getFullYear() +
        "-" +
        (this.userSelectionTime.end_time.getMonth() + 1) +
        "-" +
        this.userSelectionTime.end_time.getDate()
      );
    }
  },
  mounted() {
    this.userId=this.$store.state.username
    this.jsType=this.$store.state.userType
    this.orgId=this.$store.state.orgId
    if(this.jsType == 'city' || this.jsType == 'area' || this.jsType == 'school'){
      this.shaixuanshow='筛选'
    }
    console.log("图表页当前角色："+this.jsType+",用户为："+this.userId+",单位id为"+this.orgId)
    if (this.$route.params.starttime == undefined) {
      this.userSelectionTime.start_time = new Date(
        new Date().getTime() - 30 * 24 * 3600 * 1000
      );
      this.userSelectionTime.end_time = new Date();
    } else {
      this.userSelectionTime.start_time = this.$route.params.starttime;
      this.userSelectionTime.end_time = this.$route.params.endtime;
    }

    let myChart1 = require("echarts").init(document.getElementById("myChart1"));
    myChart1.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      legend: {
        orient: "horizontal",
        x: "center",
        y: "bottom"
        //data: ["机构人员", "教师", "学生/家长"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "6%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        axisLabel: {
          interval: 0, //横轴信息全部显示
          rotate: 45 //-15度角倾斜显示
        }
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "机构人员",
          type: "bar",
          stack: "总量",
          color: "#0084ff"
          // label: {
          //   normal: {
          //     show: true,
          //     position: "insideRight"
          //   }
          // },
        },
        {
          name: "教师",
          type: "bar",
          stack: "总量",
          color: "#3fb1ff"
          // label: {
          //   normal: {
          //     show: true,
          //     position: "insideRight"
          //   }
          // },
        },
        {
          name: "学生/家长",
          type: "bar",
          barWidth: "40%",
          stack: "总量",
          color: "#7fcbff"
          // label: {
          //   normal: {
          //     show: true,
          //     position: "insideRight"
          //   }
          // },
        }
      ]
    });

    //防止未筛选值未undefined
    if (this.$route.params.xxid == undefined) {
      this.accessSchoolId = "";
    } else {
      this.accessSchoolId = this.$route.params.xxid;
    }
    if (this.$route.params.jsid == undefined || this.$route.params.jsid == "") {
      this.userarr = ["机构人员", "教师", "学生/家长"];
      this.userType = "exec,teac,stu,gud";
    } else {
      this.userarr = this.$route.params.jsid;
      for (let i = 0; i < this.$route.params.jsid.length; i++) {
        let ls = "";
        if (this.$route.params.jsid[i] == "机构人员") {
          ls = "exec";
        } else if (this.$route.params.jsid[i] == "教师") {
          ls = "teac";
        } else {
          ls = "stu,gud";
        }
        if (this.userType == "") {
          this.userType = ls;
        } else {
          this.userType = this.userType + "," + ls;
        }
      }
    }
    ///////

    this.xzzj(
      "/api/zone/phone/biuseractivity/getNewUserData?page=0&limi=0&accessRegionId=" +
        this.szzh(this.orgId) +
        "&userType=" +
        this.userType +
        "&accessSchoolId=" +
        this.accessSchoolId +
        "&startdate=" +
        this.gshtime(new Date()) +
        "&enddate=" +
        this.gshtime(new Date())
    );
    this.sjsx(
      "/api/zone/phone/biuseractivity/getUseractData?page=0&limi=0&accessRegionId=" +
        this.szzh(this.orgId) +
        "&userType=" +
        this.userType +
        "&accessSchoolId=" +
        this.accessSchoolId +
        "&startdate=" +
        this.gshtime(this.userSelectionTime.start_time) +
        "&enddate=" +
        this.gshtime(this.userSelectionTime.end_time)
    );
  },
  methods: {
    xx() {
      this.$router.push({
        name: "ActivityDet",
        params: {
          orgId: this.szzh(this.orgId),
          userType: this.userType,
          accessSchoolId: this.accessSchoolId,
          start_time: this.gshtime(this.userSelectionTime.start_time),
          end_time: this.gshtime(this.userSelectionTime.end_time)
        }
      });
    },
    gshtime(time) {
      //结束时间格式化计算函数
      return (
        time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
      );
    },
    szzh(v) {
      if (this.jsType == "area") {
        let ls = "";
        for (let i = 0; i < v.length; i++) {
          if (
            v.charAt(i) === "" ||
            v.charAt(i) == null ||
            v.charAt(i) == " " ||
            isNaN(v.charAt(i))
          ) {
          } else {
            ls = ls + v.charAt(i);
          }
        }
        return ls;
      } else {
        return v;
      }
    },
    onClickLeft() {
      this.$router.push({ path: "/index" });
    },
    onClickRight() {
      this.$router.push({
        name: "Screen",
        params: {
          ly: "Activity", //来源
          js: this.jsType, //角色
          qy: this.orgId, //权限
          starttime:this.userSelectionTime.start_time,
          endtime:this.userSelectionTime.end_time
        }
      });
    },
    confirmPicker1(value) {
      //开始时间确定按钮
      let a = this.userSelectionTime.end_time.getTime();
      a = new Date(a);
      if (value < a.setMonth(a.getMonth() - 1)) {
        this.show = true;
        this.tishi = "仅能查看一个月内的数据";
      } else {
        this.userSelectionTime.start_time = value;
        this.sjsx(
          "/api/zone/phone/biuseractivity/getUseractData?page=0&limi=0&accessRegionId=" +
            this.orgId +
            "&userType=" +
            this.userType +
            "&accessSchoolId=" +
            this.accessSchoolId +
            "&startdate=" +
            this.gshtime(this.userSelectionTime.start_time) +
            "&enddate=" +
            this.gshtime(this.userSelectionTime.end_time)
        );
      }
      this.show1 = false;
    },
    confirmPicker2(value) {
      //结束时间确定按钮
      let a = this.userSelectionTime.start_time.getTime();
      a = new Date(a);
      if (value > a.setMonth(a.getMonth() + 1)) {
        this.show = true;
        this.tishi = "仅能查看一个月内的数据";
      } else {
        this.userSelectionTime.end_time = value;
        this.sjsx(
          "/api/zone/phone/biuseractivity/getUseractData?page=0&limi=0&accessRegionId=" +
            this.orgId +
            "&userType=" +
            this.userType +
            "&accessSchoolId=" +
            this.accessSchoolId +
            "&startdate=" +
            this.gshtime(this.userSelectionTime.start_time) +
            "&enddate=" +
            this.gshtime(this.userSelectionTime.end_time)
        );
        this.show2 = false;
      }
    },
    xzzj(dz) {
      //今日新增和用户总计
      this.$axios.get(dz).then(response => {
        if(response.data.data.length>0){
        this.xzsj = response.data.data[0].活跃用户;
        this.zjsj = response.data.data[0].totalct;
        }
      });
    },
    sjsx(dz) {
      //柱状图图表
      console.log("当前地址：" + dz);
      let myChart1 = require("echarts").init(
        document.getElementById("myChart1")
      );
      this.$axios.get(dz).then(response => {
        this.sjdata = [];
        this.jgdata = [];
        this.jsdata = [];
        this.xsjzdata = [];
        for (let i = 0; i < response.data.data.length; i++) {
          this.sjdata.push(response.data.data[i].datestr);
          this.jgdata.push(response.data.data[i].exect);
          this.jsdata.push(response.data.data[i].teact);
          this.xsjzdata.push(response.data.data[i].gsct);
        }

        let sj = [];
        for (let i = 0; i < this.userarr.length; i++) {
          let ls = {};
          if (this.userarr[i] == "机构人员") {
            ls.name = "机构人员";
            ls.data = this.jgdata;
          } else if (this.userarr[i] == "教师") {
            ls.name = "教师";
            ls.data = this.jsdata;
          } else {
            ls.name = "学生/家长";
            ls.data = this.xsjzdata;
          }
          sj.push(ls);
        }

        myChart1.setOption({
          xAxis: {
            data: this.sjdata
          },
          legend: { data: this.userarr },
          series: sj
        });
      });
    }
  }
};
</script>

<style>
#activity .main {
  padding: 10px;
}
#activity .lm1 {
  padding: 25px 0;
  box-sizing: border-box;
  overflow: hidden;
  height: 111px;
}
#activity .lm1 li {
  float: left;
  width: 50%;
  box-sizing: border-box;
}
#activity .lm1 li:nth-child(1) {
  border-right: solid 1px #cdd9ed;
}
#activity .lm1 li h3 {
  font-size: 30px;
  color: #0182dc;
  font-weight: normal;
  padding: 0;
  margin: 0;
  display: block;
  text-align: center;
}
#activity .lm1 li span {
  font-size: 16px;
  color: #333;
  font-weight: normal;
  padding: 0;
  margin: 0;
  display: block;
  text-align: center;
}
#activity .lm2 {
  padding-top: 20px;
}
</style>