<template>
  <div class="relative flex min-h-screen w-full flex-col bg-transparent font-display text-white dark group/design-root">
    <div class="relative layout-container flex h-full grow flex-col">
      <div class="flex flex-1 justify-center">
        <div class="layout-content-container flex w-full max-w-6xl flex-col">

          <!-- HEADER DLA GOŚCIA -->
          <HeaderComponent
              v-if="auth.booted && !auth.isAuthenticated"
              @open-login="showLogin = true"
              @open-register="showRegister = true"
          />

          <!-- HEADER DLA ZALOGOWANEGO -->
          <HeaderComponentWithBalance
              v-if="auth.booted && auth.isAuthenticated"
              :balance="auth.balance ?? 0"
              @logout="onLogout"
          />

          <!-- Main content -->
          <main class="flex flex-col gap-10 py-10 md:gap-16 md:py-16" v-if="auth.booted">
            <HeroSection />
            <GamesGrid />
            <LeaderboardSection />
          </main>

        </div>
      </div>

      <FooterComponent v-if="auth.booted" />
    </div>

    <!-- Modals -->
    <LoginModal v-if="showLogin" @close="showLogin = false" @login="onLoggedIn" />
    <RegisterModal v-if="showRegister" @close="showRegister = false" />

    <DepositModal v-if="auth.isAuthenticated"/>
    <WithdrawModal v-if="auth.isAuthenticated"/>
    <AccountModal v-if="auth.isAuthenticated"/>
    <TransactionHistoryModal v-if="auth.isAuthenticated"/>
    <SlotGameModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import HeaderComponent from '@/components/HeaderComponent.vue'
import HeaderComponentWithBalance from '@/components/HeaderComponentWithBalance.vue'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'
import HeroSection from '@/components/HeroSection.vue'
import GamesGrid from '@/components/GamesGrid.vue'
import LeaderboardSection from '@/components/LeaderboardSection.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import DepositModal from '@/components/DepositModal.vue'
import WithdrawModal from '@/components/WithdrawModal.vue'
import AccountModal from '@/components/AccountModal.vue'
import TransactionHistoryModal from '@/components/TransactionHistoryModal.vue'
import SlotGameModal from '@/components/SlotGameModal.vue'

const auth = useAuthStore()
const showLogin = ref(false)
const showRegister = ref(false)

onMounted(async () => {
  auth.hydrateFromStorage()
  if (auth.isAuthenticated) await auth.fetchBalance()
})

async function onLoggedIn(payload: { token: string; user: any }) {
  auth.loginSuccess(payload.token, payload.user)
  await auth.fetchBalance()
  showLogin.value = false
}

function onLogout() {
  auth.logout()
}
</script>
