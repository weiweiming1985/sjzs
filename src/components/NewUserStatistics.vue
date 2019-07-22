<template>
  <div id="newuserstatistics">
    <van-nav-bar
      title="新用户注册"
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
            <span>今日新增(人)</span>
          </li>
          <li>
            <h3>{{zjsj}}</h3>
            <span>用户总计(人)</span>
          </li>
        </ul>
      </div>
      <div class="mb lm2">
        <div class="van-tabs van-tabs--card">
          <div class="van-tabs__wrap">
            <div role="tablist" class="van-tabs__nav van-tabs__nav--card">
              <div role="tab" @click="qh(1)" class="van-tab" :class="{'van-tab--active':this.dq1}">
                <span class="van-ellipsis">新用户趋势图</span>
              </div>
              <div role="tab" @click="qh(0)" class="van-tab" :class="{'van-tab--active':!this.dq1}">
                <span class="van-ellipsis">用户角色占比</span>
              </div>
            </div>
          </div>
          <div class="van-tabs__content van-tabs__content--animated">
            <div
              class="van-tabs__track"
              style="transform: translate3d(-100%, 0px, 0px); transition-duration: 0.3s;"
              :style="{'transform':(this.dq1 ? 'translate3d(0%, 0px, 0px)' : 'translate3d(-100%, 0px, 0px)')}"
            >
              <div
                role="tabpanel"
                class="van-tab__pane-wrapper"
                aria-hidden="true"
                :class="{'van-tab__pane-wrapper--inactive':!this.dq1}"
              >
                <div class="van-tab__pane">
                  <div class="time">
                    <van-cell-group>
                      <van-field @click="show1 = true" placeholder="请选择开始时间" v-model="starttime" />
                    </van-cell-group>至
                    <van-cell-group>
                      <van-field @click="show2 = true" placeholder="请选择结束时间" v-model="endtime" />
                    </van-cell-group>
                  </div>
                  <div id="myChart1" style="width:100%;height:300px;"></div>
                  <van-button class="xxxx" @click="xx" type="default">查看详细信息>></van-button>
                </div>
              </div>
              <div
                role="tabpanel"
                class="van-tab__pane-wrapper"
                :class="{'van-tab__pane-wrapper--inactive':this.dq1}"
              >
                <div class="van-tab__pane">
                  <div id="myChart2" style="width:100%;height:300px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-popup v-model="show1" position="bottom">
        <van-datetime-picker
          v-model="userSelectionTime.start_time"
          type="date"
          :min-date="minDate"
          :max-date="userSelectionTime.end_time"
          @confirm="confirmPicker1"
          @change="sjbh"
          @cancel="quxiao"
        />
      </van-popup>
      <van-popup v-model="show2" position="bottom">
        <van-datetime-picker
          v-model="userSelectionTime.end_time"
          type="date"
          :min-date="userSelectionTime.start_time"
          :max-date="maxDate"
          @confirm="confirmPicker2"
          @change="sjbh"
          @cancel="quxiao"
        />
      </van-popup>
    </div>
    <van-popup class="tishi" v-model="show">{{tishi}}</van-popup>
  </div>
</template>

<script>
export default {
  name: "newuserstatistics",
  data() {
    return {
      userId: "", //用户id

      jsType: "",
      orgId: "", //区域
      accessSchoolId: "",

      userType: "", //角色
      userarr: ["机构人员", "教师", "学生/家长"],
      
      sjdata1: [],
      rsdata1: [],
      xzsj: 0,
      zjsj: 0,
      zbjg: 0,
      zbjs: 0,
      zbxsjz: 0,
      dq1: true,
      userSelectionTime: {
        start_time: new Date(new Date().getTime() - 30 * 24 * 3600 * 1000),
        end_time: new Date()
      },
      show1: false,
      show2: false,
      show: false, //提示弹窗
      tishi: "",
      minDate: new Date(2017, 10, 1),
      maxDate: new Date()
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
      tooltip: {},
      xAxis: {
        axisLabel: {
          interval: Math.floor(15 / 15), //横轴信息全部显示parseInt(15/7)
          rotate: 45 //-15度角倾斜显示
        },
        data: this.sjdata1
      },
      yAxis: { type: "value" },
      grid: {
        x: 40,
        y: 20,
        x2: 0,
        y2: 60
      },
      series: [
        {
          name: "人数",
          type: "line"
        }
      ]
    });
    let myChart2 = require("echarts").init(document.getElementById("myChart2"));
    myChart2.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        orient: "horizontal",
        x: "center",
        y: "bottom",
        data: ["学生/家长", "教师", "机构人员"]
      },
      grid: {
        left: "0px",
        right: "600px",
        bottom: "10%",
        containLabel: true
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              formatter: "{b} \r\n{d}%",
              position: "inner"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "30",
                fontWeight: "bold"
              }
            }
          },
          itemStyle: {
            color: function(params) {
              var colorList = ["#0084ff", "#03c1b6", "#ff9d1d"];
              return colorList[params.dataIndex];
            }
          },
          labelLine: {
            normal: {
              show: true
            }
          }
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
      this.userType = "";
    } else {
      this.userarr = this.$route.params.jsid;
      console.log("测试："+this.userType)
      for (let i = 0; i < this.$route.params.jsid.length; i++) {
        let ls = "";
        if (this.$route.params.jsid[i] == "机构人员") {
          ls = "Executive";
        } else if (this.$route.params.jsid[i] == "教师") {
          ls = "Teacher";
        } else {
          ls = "Student,Guardian";
        }
        if (this.userType == "") {
          this.userType = ls;
        } else {
          this.userType = this.userType + "," + ls;
        }
      }
    }
    ///////

    this.sjsx1(
      "/api/zone/phone/biuseractivity/getNewUserData?page=0&limi=0&accessRegionId=" +
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
    this.sjsx2("/api/zone/phone/biuseractivity/getNewUserData?page=0&limi=0");
  },
  methods: {
    xx() {
      this.$router.push({
        name: "NewUserStatisticsDet",
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
      //筛选按钮
      this.$router.push({
        name: "Screen",
        params: {
          ly: "NewUserStatistics", //来源
          js: this.jsType, //角色
          qy: this.orgId, //权限
          starttime:this.userSelectionTime.start_time,
          endtime:this.userSelectionTime.end_time
        }
      });
    },
    qh(v) {
      if (v != this.dq1) {
        this.dq1 = !this.dq1;
      }
    },
    confirmPicker1(value) {
      let a = this.userSelectionTime.end_time.getTime();
      a = new Date(a);
      if (value < a.setMonth(a.getMonth() - 1)) {
        this.show = true;
        this.tishi = "仅能查看一个月内的数据";
      } else {
        this.userSelectionTime.start_time = value;
        this.sjsx1(
          "/api/zone/phone/biuseractivity/getNewUserData?page=0&limi=0&accessRegionId=" +
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
      }
      this.show1 = false;
    },
    confirmPicker2(value) {
      let a = this.userSelectionTime.start_time.getTime();
      a = new Date(a);
      if (value > a.setMonth(a.getMonth() + 1)) {
        this.show = true;
        this.tishi = "仅能查看一个月内的数据";
      } else {
        this.userSelectionTime.end_time = value;
        this.sjsx1(
          "/api/zone/phone/biuseractivity/getNewUserData?page=0&limi=0&accessRegionId=" +
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
        this.show2 = false;
      }
    },
    quxiao() {
      this.show1 = false;
      this.show2 = false;
      this.lsstarttime = this.userSelectionTime.start_time;
      this.lsendtime = this.userSelectionTime.end_time;
    },
    sjbh() {},
    sjsx1(dz) {
      console.log("当前地址：" + dz);

      let myChart1 = require("echarts").init(
        document.getElementById("myChart1")
      );
      this.$axios.get(dz).then(response => {
        if (response.data.sign) {
          this.sjdata1 = [];
          this.rsdata1 = [];

          for (let i = 0; i < response.data.data.length; i++) {
            this.sjdata1.push(response.data.data[i].datetimes);
            this.rsdata1.push(response.data.data[i].新增用户);
            if (response.data.data[i].datetimes == this.gshtime(new Date())) {
              this.xzsj = response.data.data[i].新增用户;
              this.zjsj = response.data.data[i].totalct;
            }
          }
          myChart1.setOption({
            tooltip: {},
            xAxis: {
              axisLabel: {
                interval: Math.floor(this.sjdata1.length / 7), //横轴信息全部显示parseInt(15/7)
                rotate: 45 //-15度角倾斜显示
              },
              data: this.sjdata1
            },
            series: [
              {
                name: "人数",
                data: this.rsdata1
              }
            ]
          });
        } else {
          this.show = true;
          this.tishi = response.data.msg;
        }
      });
    },
    sjsx2(dz) {
      console.log("当前地址2：" + dz);

      let myChart2 = require("echarts").init(
        document.getElementById("myChart2")
      );
      this.$axios.get(dz).then(response => {
        let jz = 0;
        let xs = 0;

        for (let i = 0; i < response.data.usertypes.length; i++) {
          if (response.data.usertypes[i].type == "Guardian") {
            jz = response.data.usertypes[i].ct;
          } else if (response.data.usertypes[i].type == "Student") {
            xs = response.data.usertypes[i].ct;
          } else if (response.data.usertypes[i].type == "Teacher") {
            this.zbjs = response.data.usertypes[i].ct;
          } else if (response.data.usertypes[i].type == "Executive") {
            this.zbjg = response.data.usertypes[i].ct;
          }
        }
        this.zbxsjz = jz + xs;

        myChart2.setOption({
          series: [
            {
              data: [
                { value: this.zbxsjz, name: "学生/家长" },
                { value: this.zbjs, name: "教师" },
                { value: this.zbjg, name: "机构人员" }
              ]
            }
          ]
        });
      });
    }
  }
};
</script>

<style>
#newuserstatistics .main {
  padding: 10px;
}
#newuserstatistics .lm1 {
  padding: 25px 0;
  box-sizing: border-box;
  overflow: hidden;
}
#newuserstatistics .lm1 li {
  float: left;
  width: 50%;
  box-sizing: border-box;
}
#newuserstatistics .lm1 li:nth-child(1) {
  border-right: solid 1px #cdd9ed;
}
#newuserstatistics .lm1 li h3 {
  font-size: 30px;
  color: #0182dc;
  font-weight: normal;
  padding: 0;
  margin: 0;
  display: block;
  text-align: center;
}
#newuserstatistics .lm1 li span {
  font-size: 16px;
  color: #333;
  font-weight: normal;
  padding: 0;
  margin: 0;
  display: block;
  text-align: center;
}
.van-tabs--card {
  padding-top: 60px;
  margin-top: 20px;
}
.van-tabs--card > .van-tabs__wrap {
  height: 40px;
  width: 80%;
  left: 10%;
}
.van-tabs__nav--card {
  border-color: #0097ff;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
}
.van-tabs__nav--card .van-tab.van-tab--active {
  background-color: #0097ff;
  border-right: none;
}
.van-tabs__nav--card .van-tab {
  line-height: 40px;
  color: #0097ff;
  border-right: none;
}
.lm2 {
  min-height: 540px;
}
</style>
