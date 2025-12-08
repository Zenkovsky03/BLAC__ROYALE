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
            <GamesGrid  @gameClick="openGameModal"/>
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
    <SliderGameModal
      v-if="showSlider"
      :balance="auth.balance ?? 0"
      @close="showSlider = false"
      @balanceChange="handleBalanceChange"
    />
    <MinesweeperGameModal
        v-if="showMinesweeper"
        :balance="auth.balance ?? 0"
        @close="showMinesweeper = false"
        @balanceChange="handleBalanceChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
import HeaderComponentWithBalance from '@/components/layout/HeaderComponentWithBalance.vue'
import LoginModal from '@/components/modals/LoginModal.vue'
import RegisterModal from '@/components/modals/RegisterModal.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import GamesGrid from '@/components/sections/GamesGrid.vue'
import LeaderboardSection from '@/components/sections/LeaderboardSection.vue'
import FooterComponent from '@/components/layout/FooterComponent.vue'
import DepositModal from '@/components/modals/DepositModal.vue'
import WithdrawModal from '@/components/modals/WithdrawModal.vue'
import AccountModal from '@/components/modals/AccountModal.vue'
import TransactionHistoryModal from '@/components/modals/TransactionHistoryModal.vue'
import SlotGameModal from '@/components/games/SlotGameModal.vue'
import MinesweeperGameModal from '@/components/games/MinesweeperGameModal.vue'
import SliderGameModal from '@/components/games/SliderGameModal.vue'
const auth = useAuthStore()
const showLogin = ref(false)
const showRegister = ref(false)
const showMinesweeper = ref(false)
const showSlider = ref(false)
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

async function handleBalanceChange(amount: number) {
  // UWAGA: Ta implementacja jest mockowa.
  // W tym mocku, zmieniamy saldo w Pinia Store i odświeżamy
  if (auth.balance !== null) {
    auth.balance += amount
  }
}
function openGameModal(game: { id: string, name: string }) {
  if (!auth.isAuthenticated) {
      showLogin.value = true;
      return;
  }

  if (game.id === 'minesweeper') {
    showMinesweeper.value = true;
  }
  if (game.id === 'slider') {
    showSlider.value = true;
  }
  // Tutaj dodasz logikę dla innych gier:
}
</script>
