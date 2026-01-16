import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterUser from '../views/auth/RegisterView.vue';
import LoginUser from '../views/auth/LoginView.vue';
import SongsView from '../views/songs/SongsView.vue'
import CreateSong from '../views/songs/CreateSong.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: HomeView
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