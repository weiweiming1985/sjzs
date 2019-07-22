import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      username:'',
      userType:'',
      orgId:''
    },
    mutations: {
      saveNAME(state, data) {
        state.username = data;
      },
      saveTYPE(state, data) {
        state.userType = data;
      },
      saveID(state, data) {
        state.orgId = data;
      }
    },
    actions: {
  
    }
  })
  
  export default store;