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
    path: '/about',
    name: 'about',
    component: () => import('@/views/About'),
    beforeEnter: requireAuth
  },
  {
    path: "/horse",
    name: "horse",
    component: () => import("@/views/horse/Index"),
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
