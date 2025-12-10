<template>
  <main class="flex flex-col gap-10 py-10 md:gap-16 md:py-16">
    <section class="px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-6 rounded-xl border border-primary/30 bg-background-dark/50 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:grid-cols-3 lg:gap-8 lg:p-8">

        <div class="flex flex-col gap-6 lg:col-span-1">
          <div class="flex items-center gap-4">
            <img alt="User Avatar" class="h-16 w-16 rounded-full border-2 border-primary shadow-glow-primary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsZLYQAYUqMhZbUIuTqO7srsKXNp6yrj2QIqxVWUG4F_vuZvC7_tR_PMij_Gvcv8txeRgQxzOja4eap-mAqCMpUFznhghXbr8p7I32hOQphTp1IZNr8HWSiwmvxLqc_1WB0A4zW4fxmNKxV1d8HFcDdv8oZimsK1Vv5-Od5sPS_uHMEiBC4DjOedVJRdL9n78hAl6nohVLOPiOCv-w_ojSi8Td18iZhLfSA-vH8gh2K2DtwUe6INEh4SwmSh04qu4K4majW8f_5Ro" />
            <div>
              <p class="text-sm text-secondary">Welcome back,</p>
              <h1 class="text-2xl font-bold tracking-wider text-white">{{ auth.user?.username || 'Gracz' }}</h1>
            </div>
          </div>
          <div class="flex flex-col gap-2 rounded-lg border border-secondary/20 bg-black/20 p-4 shadow-glow-secondary">
            <p class="text-sm font-medium uppercase tracking-widest text-secondary/70">Total Balance</p>
            <p class="font-mono text-4xl font-bold text-white">{{ auth.balance ?? 0 }}$</p>
          </div>
          <div class="flex flex-col gap-4">
            <h2 class="text-lg font-bold uppercase tracking-widest text-primary">Recent Activity</h2>

            <div class="flex flex-col gap-3">

              <div v-if="auth.transactions.length === 0" class="text-white/50 text-sm italic">
                No recent activity.
              </div>

              <div
                  v-for="tx in auth.transactions"
                  :key="tx.id"
                  class="flex items-center justify-between text-sm rounded-lg bg-white/5 p-2 px-3 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div class="flex items-center gap-3">
        <span
            class="material-symbols-outlined"
            :class="getIconColor(tx.type)"
        >
          {{ getIconName(tx.type) }}
        </span>

                  <p class="text-white/80">
                    {{ formatLabel(tx.type) }}
                    <span class="text-xs text-white/40 block">{{ formatDate(tx.timestamp) }}</span>
                  </p>
                </div>

                <p class="font-mono font-bold" :class="getAmountColor(tx.type)">
                  {{ getSign(tx.type) }}${{ Number(tx.amount).toFixed(2) }}
                </p>
              </div>

            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6 lg:col-span-2">
          <h2 class="text-lg font-bold uppercase tracking-widest text-primary">Account Management</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div
                class="group flex cursor-pointer flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-secondary hover:shadow-glow-secondary"
                @click="handlePersonalInfoClick"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">person</span>
                <h3 class="font-bold text-white">Personal Information</h3>
              </div>
              <p class="text-sm text-white/70">Update your profile details and contact information.</p>
            </div>

            <div
                class="group flex cursor-pointer flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-secondary hover:shadow-glow-secondary"
                @click="handleChangePasswordClick"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">lock</span>
                <h3 class="font-bold text-white">Change Password</h3>
              </div>
              <p class="text-sm text-white/70">Enhance your account security by updating your password.</p>
            </div>

            <div
                class="group flex cursor-pointer flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-secondary hover:shadow-glow-secondary"
                @click="handleNotificationsClick"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">notifications</span>
                <h3 class="font-bold text-white">Notifications</h3>
              </div>
              <p class="text-sm text-white/70">Manage your communication preferences and alerts.</p>
            </div>

            <div
                class="group flex cursor-pointer flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-secondary hover:shadow-glow-secondary"
                @click="handleSecurityClick"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">security</span>
                <h3 class="font-bold text-white">Security Settings</h3>
              </div>
              <p class="text-sm text-white/70">View and manage two-factor authentication and login history.</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 1. Importujemy store

const router = useRouter();
const auth = useAuthStore(); // 2. Używamy store

// Funkcje obsługujące kliknięcia w kafelki
const handlePersonalInfoClick = () => {
  router.push('/panel/profile');
};

const handleSecurityClick = () => {
  router.push('/panel/security');
};

const handleChangePasswordClick = () => {
  router.push('/panel/password');
};

const handleNotificationsClick = () => {
  router.push('/panel/notifications');
};


// Helpery do ikon i kolorów
const getIconName = (type) => {
  if (['DEPOSIT', 'WIN'].includes(type)) return 'arrow_upward';
  if (['WITHDRAWAL', 'LOST', 'BET'].includes(type)) return 'arrow_downward';
  return 'circle';
};

const getIconColor = (type) => {
  if (['DEPOSIT', 'WIN'].includes(type)) return 'text-green-400';
  return 'text-red-400';
};

const getAmountColor = (type) => {
  if (['DEPOSIT', 'WIN'].includes(type)) return 'text-green-400';
  return 'text-red-400';
};

const getSign = (type) => {
  if (['DEPOSIT', 'WIN'].includes(type)) return '+';
  return '-';
};

const formatLabel = (type) => {
  switch (type) {
    case 'DEPOSIT': return 'Deposit Funds';
    case 'WITHDRAWAL': return 'Withdrawal';
    case 'WIN': return 'Game Win';
    case 'LOST': return 'Game Loss';
    case 'BET': return 'Game Bet';
    default: return type;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.shadow-glow-primary {
  box-shadow: 0 0 20px 5px rgba(249, 0, 255, 0.5), 0 0 8px 2px rgba(249, 0, 255, 0.6) inset;
}
.shadow-glow-secondary {
  box-shadow: 0 0 15px 5px rgba(0, 246, 255, 0.4);
}
</style>