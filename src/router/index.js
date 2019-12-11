import Vue from 'vue'
import VueRouter from 'vue-router'
import { requireAuth } from '@/services/auth';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home'),
    //beforeEnter: requireAuth
  },
  {
    path: "/horse/stallion",
    name: "hengst",
    component: () => import("@/views/horse/Table"),
    beforeEnter: requireAuth
  },
  {
    path: "/horse/mare",
    name: "merrie",
    component: () => import("@/views/horse/Table"),
    beforeEnter: requireAuth
  },
  {
    path: "/horse/:id",
    name: "horse",
    props: true,
    component: () => import("@/views/horse/Horse"),
    beforeEnter: requireAuth
  },
  {
    path: "/customer",
    name: "customer",
    component: () => import("@/views/customer/Index"),
    beforeEnter: requireAuth
  },
  {
    path: "/customer/:id",
    props: true,
    name: "customer page",
    component: () => import("@/views/customer/Customer"),
    beforeEnter: requireAuth
  },
  {
    path: '/callback',
    component: () => import('@/components/Callback')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
