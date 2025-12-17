import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AdminPanel from '../components/modals/AdminPanelModal.vue'

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

        // TRASA ADMINA
        {
            path: '/admin',
            name: 'AdminPanel',
            component: AdminPanel,
            meta: { requiresAuth: true, requiresAdmin: true } //
        },
        {
            path: '/legal/terms',
            name: 'terms',
            component: () => import('@/components/layout/footer/TermsView.vue')
        },
        {
            path: '/legal/privacy',
            name: 'privacy',
            component: () => import('@/components/layout/footer/PrivacyView.vue')
        },
        {
            path: '/legal/responsible-gaming',
            name: 'responsible-gaming',
            component: () => import('@/components/layout/footer/ResponsibleGamingView.vue')
        },

        // SUPPORT
        {
            path: '/support/faq',
            name: 'faq',
            component: () => import('@/components/layout/footer/FAQView.vue')
        },
        {
            path: '/support/contact',
            name: 'contact',
            component: () => import('@/components/layout/footer/ContactView.vue')
        },
        {
            path: '/support/affiliates',
            name: 'affiliates',
            component: () => import('@/components/layout/footer/AffiliatesView.vue')
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: () => import('@/views//ResetPasswordView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found', //
            component: NotFoundView
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    if (!auth.booted) {
        auth.hydrateFromStorage()
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next('/home')
    }

    if (to.meta.requiresAdmin) {
        // Jeśli rola użytkownika to NIE jest 'ADMIN'
        if (auth.user?.role !== 'ADMIN') {
            // Przekieruj na stronę 404 (NotFound), przekazując obecną ścieżkę jako parametr
            // Dzięki temu URL zmieni się na taki, jaki wpisał użytkownik, ale wyświetli się błąd 404
            return next({
                name: 'not-found',
                params: { pathMatch: to.path.substring(1).split('/') }
            })
        }
    }

    // Jeśli wszystko ok, idź dalej
    next()
})