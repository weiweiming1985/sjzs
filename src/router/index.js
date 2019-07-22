import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      redirect:'/index'
    },
    {
      path: '/index',
      name: 'index',
      component: resolve => require(['@/components/index'],resolve),
    },
    {
      path: '/NewUserStatistics',
      name: 'NewUserStatistics',
      component: resolve => require(['@/components/NewUserStatistics'],resolve),
    },
    {
      path: '/NewUserStatistics/NewUserStatisticsDet',
      name: 'NewUserStatisticsDet',
      component: resolve => require(['@/components/NewUserStatisticsDet'],resolve),
    },
    {
      path: '/AppData',
      name: 'AppData',
      component: resolve => require(['@/components/AppData'],resolve),
    },
    {
      path: '/AppData/AppDataDet',
      name: 'AppDataDet',
      component: resolve => require(['@/components/AppDataDet'],resolve),
    },
    {
      path: '/Activity',
      name: 'Activity',
      component: resolve => require(['@/components/Activity'],resolve),
    },
    {
      path: '/Activity/ActivityDet',
      name: 'ActivityDet',
      component: resolve => require(['@/components/ActivityDet'],resolve),
    },
    {
      path: '/Screen',
      name: 'Screen',
      component: resolve => require(['@/components/Screen'],resolve),
    }
  ]
})
