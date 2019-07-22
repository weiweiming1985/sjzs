<template>
  <div id="screen">
    <van-nav-bar title="筛选" left-arrow @click-left="onClickLeft" />
    <div class="main">
      <h2>徐州市</h2>
      <div class="mb lm3 qy" v-if="shi">
        <span class="title">区域选择</span>
        <van-checkbox-group v-model="quyuData">
          <van-checkbox @click="qyqx" :aria-checked="qyxz" v-text="qyxz?'全不选':'全选'">全选</van-checkbox>
          <van-checkbox v-for="quyu in quyus" :key="quyu" :name="quyu">{{ quyu }}</van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="mb lm3 xx" v-if="qu">
        <span class="title">学校选择</span>
        <van-checkbox-group v-model="xuexiaoData">
          <van-checkbox @click="xxqx" :aria-checked="xxxz" disabled v-text="xxxz?'全不选':'全选'">全选</van-checkbox>
          <van-checkbox
            v-for="(xuexiao,index) in xuexiaos"
            :key="index"
            :name="xuexiao"
          >{{ xuexiao }}</van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="mb lm3 js" v-if="xiao">
        <span class="title">用户角色选择</span>
        <van-checkbox-group v-model="jueseData">
          <van-checkbox @click="jsqx" :aria-checked="jsxz" v-text="jsxz?'全不选':'全选'">全选</van-checkbox>
          <van-checkbox v-for="juese in jueses" :key="juese" :name="juese">{{ juese }}</van-checkbox>
        </van-checkbox-group>
      </div>
      <van-button plain type="info" @click="queding">确定</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "screen",
  data() {
    return {
      ly: "",
      quyus: [] /*["鼓楼区","云龙区","泉山区","九里区","贾汪区","铜山区","新沂区","丰县","沛县","睢宁县","邳州市"]*/,
      quyuid: {},
      xuexiaos: [] /*["矿山路小学","青年路云星小学","徐州市第三十一中学","第三完全小学","徐州市第三十二中学","青年路云星小学2","徐州市第三十一中学2","徐州市第三十一中学3","青年路云星小学1","第三完全小学2","矿山路小学2"]*/,
      jueses: ["学生/家长", "教师", "机构人员"],
      quyuData: [],
      xuexiaoData: [],
      jueseData: [],
      shi: false,
      qu: false,
      xiao: false,
      xuexiaoidarr: "",
      xuexiaoid:{},
      title:''
    };
  },
  mounted() {
    if (this.$route.params.js == "city") {
      this.shi = true;
      this.qu = true;
      this.xiao = true;
      this.xzshi();
    } else if (this.$route.params.js == "area") {
      this.qu = true;
      this.xiao = true;
      this.xzqu();
    } else {
      this.xiao = true;
    }
  },
  computed: {
    qyxz: function() {
      return this.quyuData.length >= this.quyus.length;
    },
    xxxz: function() {
      if (this.xuexiaos.length == 0) {
      } else {
        return this.xuexiaoData.length >= this.xuexiaos.length;
      }
    },
    jsxz: function() {
      return this.jueseData.length >= this.jueses.length;
    }
  },
  watch: {
    // 检测区域点击事件，改变学校列表
    quyuData: function(newQuyuData, oldQuyuData) {
      let quyuarr = "";
      for (let i = 0; i < newQuyuData.length; i++) {
        if (quyuarr == "") {
          quyuarr = this.quyuid[newQuyuData[i]];
        } else {
          quyuarr = quyuarr + "," + this.quyuid[newQuyuData[i]];
        }
      }

      this.$axios
        .get(
          "/api/zone/phone/biuseractivity/getAreasAndSchools?orgId=" + quyuarr
        )
        .then(response => {
          this.xuexiaoid = {};
          this.xuexiaos = [];
          for (let i = 0; i < response.data.data.length; i++) {
            this.xuexiaos.push(response.data.data[i].ORG_NAME);
            this.xuexiaoid[response.data.data[i].ORG_NAME] =
              response.data.data[i].id;
          }
        });
    },
    // 检测学校点击事件
    xuexiaoData: function(newXuexiaoData, oldXuexiaoData) {
      let xuexiaoarr = "";
      for (let i = 0; i < newXuexiaoData.length; i++) {
        if (xuexiaoarr == "") {
          xuexiaoarr = this.xuexiaoid[newXuexiaoData[i]];
        } else {
          xuexiaoarr = xuexiaoarr + "," + this.xuexiaoid[newXuexiaoData[i]];
        }
      }
      this.xuexiaoidarr = xuexiaoarr;
    }
  },
  methods: {
    queding() {
      this.$router.push({
        name: this.$route.params.ly,
        params: {
          xxid: this.xuexiaoidarr, //学校id
          jsid: this.jueseData, //学校id
          starttime: this.$route.params.starttime, //开始时间
          endtime: this.$route.params.endtime //结束时间
        }
      });
    },
    xzshi() {
      this.$axios
        .get(
          "/api/zone/phone/biuseractivity/getAreasAndSchools?orgId=" +
            this.$route.params.qy
        )
        .then(response => {
          this.quyuid = {};
          this.quyus = [];
          for (let i = 0; i < response.data.data.length; i++) {
            this.quyus.push(response.data.data[i].ORG_NAME);
            this.quyuid[response.data.data[i].ORG_NAME] =
              response.data.data[i].id;
          }
        });
    },
    xzqu() {
      this.$axios
        .get(
          "/api/zone/phone/biuseractivity/getAreasAndSchools?orgId=" +
            this.$route.params.qy
        )
        .then(response => {
          this.xiaoid = {};
          this.quyus = [];
          for (let i = 0; i < response.data.data.length; i++) {
            this.xuexiaos.push(response.data.data[i].ORG_NAME);
            this.xuexiaoid[response.data.data[i].ORG_NAME] =
              response.data.data[i].id;
          }
        });
    },
    onClickLeft() {
      this.$router.push({
        name: this.$route.params.ly
      });
    },
    qyqx() {
      if (this.quyuData.length >= this.quyus.length) {
        this.quyuData = [];
      } else {
        this.quyuData = this.quyus;
      }
    },
    xxqx() {
      if (this.xuexiaoData.length >= this.xuexiaos.length) {
        this.xuexiaoData = [];
      } else {
        this.xuexiaoData = this.xuexiaos;
      }
    },
    jsqx() {
      if (this.jueseData.length >= this.jueses.length) {
        this.jueseData = [];
      } else {
        this.jueseData = this.jueses;
      }
    }
  }
};
</script>

<style>
#screen .main {
  padding: 10px;
  background-color: #fff;
}
#screen .lm3 {
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #f6f8f9;
}
.van-checkbox {
  display: inline-block;
  box-sizing: border-box;
  border: solid 1px #ccc;
  border-radius: 6px;
  line-height: 40px;
  text-align: center;
  position: relative;
}
.js .van-checkbox {
  width: 42%;
  margin: 8px 4%;
}
.qy .van-checkbox {
  padding: 0 12px;
  margin: 8px 2%;
}
.xx .van-checkbox {
  padding: 0 12px;
  margin: 8px;
}
.van-checkbox[aria-checked="true"] {
  border-color: #0097fe;
  background-color: #0097fe;
  color: #fff;
}
.van-checkbox__icon {
  display: none;
}
.van-checkbox__label {
  margin: 0;
  color: #333;
}
.van-checkbox[aria-checked="true"] .van-checkbox__label {
  color: #fff;
}
#screen h2 {
  font-size: 24px;
  font-weight: normal;
}
#screen .title {
  line-height: 40px;
  font-size: 18px;
}

#screen .van-button {
  width: 60%;
  border-radius: 6px;
  margin-bottom: 30px;
  margin-left: 20%;
  margin-top: 20px;
}
</style>