<template>
  <div class="relative flex min-h-screen w-full flex-col bg-transparent font-display text-white dark group/design-root">
    <div class="relative layout-container flex h-full grow flex-col">
      <div class="flex flex-1 justify-center">
        <div class="layout-content-container flex w-full max-w-6xl flex-col">

          <HeaderComponent
              v-if="auth.booted && !auth.isAuthenticated"
              @open-login="showLogin = true"
              @open-register="showRegister = true"
          />

          <HeaderComponentWithBalance
              v-if="auth.booted && auth.isAuthenticated"
              :balance="auth.balance ?? 0"
              @logout="auth.logout()"
              @open-wallet="showWalletSelection = true"
          />
          <main class="flex flex-col gap-10 py-10 md:gap-16 md:py-16" v-if="auth.booted">
            <HeroSection />
            <GamesGrid  @gameClick="openGameModal"/>
          </main>

        </div>
      </div>

      <FooterComponent v-if="auth.booted" />
    </div>

    <WalletSelectionModal
        v-if="showWalletSelection"
        @close="showWalletSelection = false"
        @select-deposit="openDeposit"
        @select-withdraw="openWithdraw"
    />

    <LoginModal v-if="showLogin" @close="showLogin = false" @login="onLoggedIn" />
    <RegisterModal v-if="showRegister" @close="showRegister = false" />

    <DepositModal v-if="showDeposit" @close="showDeposit = false"/>
    <WithdrawModal v-if="showWithdraw" @close="showWithdraw = false"/>

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

// Importy komponentów
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
import HeaderComponentWithBalance from '@/components/layout/HeaderComponentWithBalance.vue'
import FooterComponent from '@/components/layout/FooterComponent.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import GamesGrid from '@/components/sections/GamesGrid.vue'

// Importy Modali
import LoginModal from '@/components/modals/LoginModal.vue'
import RegisterModal from '@/components/modals/RegisterModal.vue'
import DepositModal from '@/components/modals/DepositModal.vue'
import WithdrawModal from '@/components/modals/WithdrawModal.vue'
import AccountModal from '@/components/modals/AccountModal.vue'
import TransactionHistoryModal from '@/components/modals/TransactionHistoryModal.vue'
import SlotGameModal from '@/components/games/SlotGameModal.vue'
import MinesweeperGameModal from '@/components/games/MinesweeperGameModal.vue'
import SliderGameModal from '@/components/games/SliderGameModal.vue'

// !!! WAŻNE: Import nowego modala !!!
import WalletSelectionModal from '@/components/modals/WalletSelectionModal.vue'

const auth = useAuthStore()

// --- Stan Modali ---
const showLogin = ref(false)
const showRegister = ref(false)

// Nowe zmienne dla portfela
const showWalletSelection = ref(false)
const showDeposit = ref(false)
const showWithdraw = ref(false)

// Gry
const showMinesweeper = ref(false)
const showSlider = ref(false)

// --- Logika Portfela ---
function openDeposit() {
  showWalletSelection.value = false // Zamykamy wybór
  showDeposit.value = true          // Otwieramy wpłatę
}

function openWithdraw() {
  showWalletSelection.value = false // Zamykamy wybór
  showWithdraw.value = true         // Otwieramy wypłatę
}

// --- Reszta Logiki ---
onMounted(async () => {
  if (auth.isAuthenticated) {
    await auth.fetchBalance()
  }
})

async function onLoggedIn(payload: { token: string; user: any }) {
  auth.loginSuccess(payload.token, payload.user)
  await auth.fetchBalance()
  showLogin.value = false
}

function handleBalanceChange(amount: number) {
  if (auth.balance !== null) {
    auth.balance += amount
  }
}

function openGameModal(game: { id: string, name: string }) {
  if (!auth.isAuthenticated) {
    showLogin.value = true;
    return;
  }
  if (game.id === 'minesweeper') showMinesweeper.value = true;
  if (game.id === 'slider') showSlider.value = true;
}
</script>