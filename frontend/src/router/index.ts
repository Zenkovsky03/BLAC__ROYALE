import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // <--- 1. IMPORTUJEMY STORE

import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

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
            // 2. OZNACZAMY TĘ TRASĘ JAKO CHRONIONĄ
            meta: { requiresAuth: true },
            component: () => import('@/views/user/UserLayout.vue'),

            children: [
                {
                    path: '',
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
        },

        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundView
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    if (!auth.booted) {
        auth.hydrateFromStorage()
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/home')
    } else {
        next()
    }
})