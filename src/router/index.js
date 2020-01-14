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
    component: () => import("@/views/horse/Stallion"),
    beforeEnter: requireAuth
  },
  {
    path: "/horse/mare",
    name: "merrie",
    component: () => import("@/views/horse/Mare"),
    beforeEnter: requireAuth
  },
  {
    path: "/horse/surrogate",
    name: "draagmoeder",
    component: () => import("@/views/horse/Surrogate"),
    beforeEnter: requireAuth
  },
  {
    path: "/horse/:id",
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
    path: "/report/location",
    name: "location report",
    component: () => import("@/views/report/Location"),
    beforeEnter: requireAuth
  },
  {
    path: "/report/death-horses",
    name: "death horses report",
    component: () => import("@/views/report/DeathHorse"),
    beforeEnter: requireAuth
  },
  {
    path: "/settings/location",
    name: "location",
    component: () => import("@/views/settings/Location"),
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
