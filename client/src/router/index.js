import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterUser from '../views/RegisterUser.vue';
import LoginUser from '../views/LoginUser.vue';
import SongsView from '../views/SongsView.vue'
import CreateSong from '../views/CreateSong.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: HomeView
},
{
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import( /* webpackChunkName: "about" */ '../views/AboutView.vue')
},
{
    path: '/register',
    name: 'register',
    component: RegisterUser
},
{
    path: '/login',
    name: 'login',
    component: LoginUser
},
{
    path: '/songs',
    name: 'songs',
    component: SongsView,
},
{
    path: '/songs/create',
    name: 'songs-create',
    component: CreateSong,
},
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router