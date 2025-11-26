import { defineStore } from 'pinia'

type User = { id: string; email: string; username?: string } | null

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '' as string,
        user: null as User,
        balance: null as number | null,
        booted: false,
    }),
    getters: {
        isAuthenticated: (s) => !!s.token,
    },
    actions: {
        loginSuccess(token: string, user: User) {
            this.token = token
            this.user = user
            localStorage.setItem('auth_token', token)
            localStorage.setItem('auth_user', JSON.stringify(user))
        },
        hydrateFromStorage() {
            const t = localStorage.getItem('auth_token')
            const u = localStorage.getItem('auth_user')
            if (t) this.token = t
            if (u) this.user = JSON.parse(u)
            this.booted = true
        },
        async fetchBalance() {
            const base = import.meta.env.VITE_API_URL || ''
            const res = await fetch(`${base}/api/wallet/balance`, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
            if (res.ok) {
                const data = await res.json()
                this.balance = data.balance ?? 0
            } else {
                this.balance = null
            }
        },
        logout() {
            this.token = ''
            this.user = null
            this.balance = null
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        },
    },
})
