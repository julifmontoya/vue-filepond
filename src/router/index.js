import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "ActivitiesList",
    component: () => import("../views/ActivitiesList.vue"),
  },
  {
    path: "/activity-detail/:id",
    name: "ActivityEdit",
    component: () => import("../views/Activity.vue"),
  },
  {
    path: "/activity-detail-create",
    name: "ActivityCreate",
    component: () => import("../views/Activity.vue"),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
