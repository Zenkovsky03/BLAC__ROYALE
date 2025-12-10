import { defineStore } from 'pinia'

type User = { id: string; email: string; username?: string } | null

interface Transaction {
    id: string;
    amount: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'WIN' | 'LOST' | 'BET';
    timestamp: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '' as string,
        user: null as any,
        balance: null as number | null,
        transactions: [] as Transaction[],
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
            const res = await fetch(`${base}/api/wallet/get-wallet`, {
                headers: { Authorization: `Bearer ${this.token}` }
            })

            if (res.ok) {
                const data = await res.json()

                this.balance = data.balance ? Number(data.balance) : 0

                this.transactions = data.transactions || []
            } else {
                this.balance = 0
                this.transactions = []
            }
        },
        // --- TO JEST FUNKCJA, KTÓREJ CI BRAKOWAŁO ---
        async fetchUser() {
            const base = import.meta.env.VITE_API_URL || ''
            if (!this.token) return;

            try {
                const res = await fetch(`${base}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                })

                if (res.ok) {
                    const userData = await res.json()

                    // Aktualizujemy dane w aplikacji
                    this.user = userData

                    // Aktualizujemy dane w pamięci przeglądarki
                    localStorage.setItem('auth_user', JSON.stringify(userData))
                }
            } catch (error) {
                console.error("Błąd pobierania profilu:", error)
            }
        },
        // ---------------------------------------------

        async updateUsername(newUsername: string) {
            const base = import.meta.env.VITE_API_URL || ''

            try {
                const res = await fetch(`${base}/api/users/update-username`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify({ username: newUsername })
                })

                if (res.ok) {
                    if (this.user) {
                        this.user.username = newUsername;
                    }
                    localStorage.setItem('auth_user', JSON.stringify(this.user));
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                return false;
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