import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegisterUser from '@/views/auth/RegisterView.vue';
import LoginUser from '@/views/auth/LoginView.vue';
import SongsView from '@/views/songs/SongsView.vue'
import CreateSong from '@/views/songs/SongCreateView.vue'
import SongDetailsView from '@/views/songs/SongDetailsView.vue';
import SongEditView from '@/views/songs/SongEditView.vue';

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
{
    path: '/songs/:id',
    name: 'song-details',
    component: SongDetailsView
},
{
    path: '/songs/:id/edit',
    name: 'song-edit',
    component: SongEditView
}
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('token');

    if(!isLoggedIn && to.path.startsWith('/songs')) {
        return next('/login');
    }

    next();
});

export default router;