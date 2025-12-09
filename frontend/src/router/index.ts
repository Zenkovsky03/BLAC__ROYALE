import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserDashboard from '@/views/user/UserDashboard.vue'

export const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        return { top: 0 }
    },
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: HomeView },

        {
            path: '/panel',
            component: () => import('@/views/user/UserLayout.vue'),

            children: [
                {
                    path: '', // Pusta ścieżka = domyślny widok po wejściu na /panel
                    name: 'user-dashboard',
                    component: () => import('@/views/user/UserDashboard.vue')
                },
                {
                    path: 'profile',
                    name: 'user-profile',
                    component: () => import('@/views/user/Profile.vue')
                },
                {
                    path: 'security',
                    name: 'user-security',
                    component: () => import('@/views/user/Security.vue')
                },
                {
                    path: 'password',
                    name: 'user-password',
                    component: () => import('@/views/user/ChangePassword.vue')
                },
                {
                    path: 'notifications',
                    name: 'user-notifications',
                    component: () => import('@/views/user/Notifications.vue')
                }
            ]
        },

        {
            path: '/games',
            name: 'games',
            component: () => import('@/components/sections/GamesGrid.vue'),
        },
        {
            path: '/leaderboard',
            name: 'leaderboard',
            component: () => import('@/components/sections/LeaderboardSection.vue')
        }
    ]
})


