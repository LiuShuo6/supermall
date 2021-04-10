import Vue from 'vue';
import VueRouter from 'vue-router'


const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/category')
const Shopcart = () => import('../views/shopcart/shopcart')
const Profile = () => import('../views/profile/profile')
const Detail = () => import('../views/detail/Detail')



//1.安装插件
Vue.use(VueRouter)

//2.创建路由对象
const routes = [
  {
    path: '',
    redirect: '/home',

  },
  {
    path: '/home',
    component: Home
  }, {
    path: '/category',
    component: Category
  }, {
    path: '/shopcart',
    component: Shopcart
  }, {
    path: '/profile',
    component: Profile
  },
  {
    path: '/detail/:iid',
    component: Detail
  }
]


const router = new VueRouter({
  routes,
  mode: 'history'
})

//3.导出
export default router