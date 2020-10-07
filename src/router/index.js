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
    path: '/icsi',
    name: 'ICSI',
    component: () => import('@/views/icsi/index'),
    beforeEnter: requireAuth
  },
  {
    path: "/icsi/create",
    props: true,
    component: () => import("@/views/icsi/Create"),
    beforeEnter: requireAuth
  },
  {
    path: "/icsi/:id",
    props: true,
    component: () => import("@/views/icsi/Embryos"),
    beforeEnter: requireAuth
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
    path: "/horse/studhorse",
    name: "dekhengsten",
    component: () => import("@/views/horse/Studhorse"),
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
    path: "/report/stock-semen-production",
    name: "Stock semen production",
    component: () => import("@/views/report/StockSemenProduction"),
    beforeEnter: requireAuth
  },
  {
    path: "/report/stock-semen-import",
    name: "Stock semen import",
    component: () => import("@/views/report/StockSemenImport"),
    beforeEnter: requireAuth
  },
  {
    path: "/report/delivered-products",
    name: "Stock delivered products",
    component: () => import("@/views/report/DeliveredProducts"),
    beforeEnter: requireAuth
  },
  {
    path: "/report/outgoing-products",
    name: "Stock outgoing products",
    component: () => import("@/views/report/OutgoingProducts"),
    beforeEnter: requireAuth
  },
  {
    path: "/report/applied-medication",
    name: "Stock applied medication",
    component: () => import("@/views/report/AppliedMedication"),
    beforeEnter: requireAuth
  },
  {
    path: "/settings/location",
    name: "location",
    component: () => import("@/views/settings/Location"),
    beforeEnter: requireAuth
  },
  {
    path: "/settings/nitrogen-container",
    name: "Stikstof vaten",
    component: () => import("@/views/settings/NitrogenContainer"),
    beforeEnter: requireAuth
  },
  {
    path: "/settings/research-sheets",
    name: "Onderzoeksfiches",
    component: () => import("@/views/settings/ResearchSheets"),
    beforeEnter: requireAuth
  },
  {
    path: "/settings/products",
    name: "Producten overview",
    component: () => import("@/views/settings/products"),
    beforeEnter: requireAuth
  },
  {
    path: "/settings/product/:id",
    props: true,
    component: () => import("@/views/settings/products/product"),
    beforeEnter: requireAuth
  },
  {
    path: "/stock",
    name: "Stock overview",
    component: () => import("@/views/stock/index"),
    beforeEnter: requireAuth
  },
  {
    path: "/stock/:id",
    props: true,
    component: () => import("@/views/stock/batch"),
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
