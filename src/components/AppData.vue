<template>
  <div id="appdata">
    <van-nav-bar
      title="应用点击量"
      left-text
      :right-text="shaixuanshow"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="main">
      <div class="mb1">
        <div class="time">
          <van-cell-group>
            <van-field @click="show1 = true" placeholder="请选择开始时间" v-model="starttime" />
          </van-cell-group>至
          <van-cell-group>
            <van-field @click="show2 = true" placeholder="请选择结束时间" v-model="endtime" />
          </van-cell-group>
        </div>
      </div>
      <div class="mb2">
        <div id="myChart1" style="width:100%;height:500px;"></div>
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
  name: "appdata",
  data() {
    return {
      userId: "", //用户id

      jsType: "",
      orgId: "", //区域
      accessSchoolId: "",

      userType: "", //角色
      userarr: ["机构人员", "教师", "学生/家长"],

      appname: [], //app名称数组
      jgdata: [], //机构数据
      jsdata: [], //教师数据
      xsjzdata: [], //学生家长数据

      shaixuanshow: "",

      userSelectionTime: {
        //开始结束时间
        start_time: new Date(new Date().getTime() - 30 * 24 * 3600 * 1000),
        end_time: new Date()
      },
      show1: false, //开始时间选择框是否显示
      show2: false, //结束时间选择框是否显示
      show: false, //提示弹窗
      tishi: "",
      minDate1: new Date(2017, 10, 1), //开始时间最小值
      minDate2: new Date(2017, 10, 1), //结束时间最小值
      maxDate1: new Date(), //开始时间最大值
      maxDate2: new Date() //结束时间最大值
    };
  },
  computed: {
    starttime: function() {
      //开始时间格式化计算函数
      return (
        this.userSelectionTime.start_time.getFullYear() +
        "-" +
        (this.userSelectionTime.start_time.getMonth() + 1) +
        "-" +
        this.userSelectionTime.start_time.getDate()
      );
    },
    endtime: function() {
      //结束时间格式化计算函数
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
    this.userId = this.$store.state.username;
    this.jsType = this.$store.state.userType;
    this.orgId = this.$store.state.orgId;
    if (
      this.jsType == "city" ||
      this.jsType == "area" ||
      this.jsType == "school"
    ) {
      this.shaixuanshow = "筛选";
    }
    console.log(
      "图表页当前角色：" +
        this.jsType +
        ",用户为：" +
        this.userId +
        ",单位id为" +
        this.orgId
    );
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
      //图表设置
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
        // data: ["机构人员", "教师", "学生/家长"]
      },
      grid: {
        left: "0px",
        right: "20px",
        bottom: "10%",
        containLabel: true
      },
      xAxis: {
        type: "value"
      },
      yAxis: {
        type: "category",
        axisLabel: {
          formatter: function(value, index) {
            let valueTxt = "";
            if (value.length > 3) {
              valueTxt = value.substring(0, 4) + "…";
            } else {
              valueTxt = value;
            }
            return valueTxt;
          }
        }
      },
      series: [
        {
          name: "机构人员",
          type: "bar",
          stack: "总量",
          color: "#0084ff",
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          }
        },
        {
          name: "教师",
          type: "bar",
          stack: "总量",
          color: "#3fb1ff",
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          }
        },
        {
          name: "学生/家长",
          type: "bar",
          barWidth: "50%",
          stack: "总量",
          color: "#7fcbff",
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          }
        }
      ]
    });

    //防止学校id未筛选值为undefined
    if (this.$route.params.xxid == undefined) {
      this.accessSchoolId = "";
    } else {
      this.accessSchoolId = this.$route.params.xxid;
    }
    //防止角色id未筛选值为undefined，同时值为空，即全选，角色数组应为全部；筛选角色中文转英文（因为新用户中的英文和其他不一样，不能在筛选中转换）
    if (this.$route.params.jsid == undefined || this.$route.params.jsid == "") {
      this.userarr = ["机构人员", "教师", "学生/家长"];
      this.userType = "";
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

    this.sjsx(
      "/api/zone/phone/biapplicationusage/getApplicationUsageData?page=0&limi=0&accessRegionId=" +
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
        name: "AppDataDet",
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
      //返回按钮
      this.$router.push({ path: "/index" });
    },
    onClickRight() {
      //筛选按钮
      this.$router.push({
        name: "Screen",
        params: {
          ly: "AppData", //来源
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
          "/api/zone/phone/biapplicationusage/getApplicationUsageData?page=0&limi=0&accessRegionId=" +
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
          "/api/zone/phone/biapplicationusage/getApplicationUsageData?page=0&limi=0&accessRegionId=" +
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
    sjsx(dz) {
      console.log("当前地址：" + dz);
      //图标数据更新函数
      let myChart1 = require("echarts").init(
        document.getElementById("myChart1")
      );
      this.$axios.get(dz).then(response => {
        this.appname = [];
        this.jgdata = [];
        this.jsdata = [];
        this.xsjzdata = [];
        for (let i = 0; i < response.data.data.length; i++) {
          this.appname.push(response.data.data[i].CLIENT_NAME);
          this.jgdata.push(response.data.data[i].totalect);
          this.jsdata.push(response.data.data[i].totaltct);
          this.xsjzdata.push(response.data.data[i].totalgct);
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
        // myChart1.hideLoading({
        //   text: '数据正在加载...'
        // })
        myChart1.setOption({
          yAxis: {
            data: this.appname
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
#appdata .mb1 {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 20px;
}
#appdata .mb2 {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 20px;
}
</style>