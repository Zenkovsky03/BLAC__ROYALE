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
              @open-panel="handlePanelClick"
          />

          <main class="flex flex-col gap-10 py-10 md:gap-16 md:py-16" v-if="auth.booted">

            <HeroSection @playRandom="openRandomGame" />

            <GamesGrid  @gameClick="openGameModal"/>
          </main>

        </div>
      </div>

      <FooterComponent v-if="auth.booted" />
    </div>

    <AdminPanelModal
        v-if="showAdminPanel"
        @close="showAdminPanel = false"
    />

    <WalletSelectionModal
        v-if="showWalletSelection"
        @close="showWalletSelection = false"
        @select-deposit="openDeposit"
        @select-withdraw="openWithdraw"
    />
    <DepositModal v-if="showDeposit" @close="showDeposit = false"/>
    <WithdrawModal v-if="showWithdraw" @close="showWithdraw = false"/>

    <LoginModal v-if="showLogin" @close="showLogin = false" @login="onLoggedIn" />
    <RegisterModal v-if="showRegister" @close="showRegister = false" />
    <TransactionHistoryModal v-if="auth.isAuthenticated"/>

    <SlotGameModal v-if="showSlots" :balance="auth.balance ?? 0" @close="showSlots = false" @balanceChange="handleBalanceChange"/>
    <SliderGameModal v-if="showSlider" :balance="auth.balance ?? 0" @close="showSlider = false" @balanceChange="handleBalanceChange"/>
    <MinesweeperGameModal v-if="showMinesweeper" :balance="auth.balance ?? 0" @close="showMinesweeper = false" @balanceChange="handleBalanceChange"/>
    <CoinflipGameModal v-if="showCoinflip" :balance="auth.balance ?? 0" @close="showCoinflip = false" @balanceChange="handleBalanceChange"/>
    <RouletteGameModal v-if="showRoulette" :balance="auth.balance ?? 0" @close="showRoulette = false" @balanceChange="handleBalanceChange"/>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router' // <--- 1. IMPORT ROUTERA

// Importy komponentów layoutu
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
import TransactionHistoryModal from '@/components/modals/TransactionHistoryModal.vue'
import WalletSelectionModal from '@/components/modals/WalletSelectionModal.vue'
import AdminPanelModal from '@/components/modals/AdminPanelModal.vue'

// Importy Gier
import SlotGameModal from '@/components/games/SlotGameModal.vue'
import MinesweeperGameModal from '@/components/games/MinesweeperGameModal.vue'
import SliderGameModal from '@/components/games/SliderGameModal.vue'
import CoinflipGameModal from '@/components/games/CoinflipGameModal.vue'
import RouletteGameModal from '@/components/games/RouletteGameModal.vue'

const auth = useAuthStore()
const router = useRouter() // <--- 2. INICJALIZACJA ROUTERA

// --- Stan Modali ---
const showLogin = ref(false)
const showRegister = ref(false)
const showWalletSelection = ref(false)
const showDeposit = ref(false)
const showWithdraw = ref(false)
const showAdminPanel = ref(false)
// showAccount usunięte, bo używamy przekierowania

// Gry
const showMinesweeper = ref(false)
const showSlider = ref(false)
const showCoinflip = ref(false)
const showRoulette = ref(false)
const showSlots = ref(false)

const isAdmin = computed(() => {
  return auth.user?.role === 'ADMIN'
})

// --- LOGIKA PRZYCISKU PANELU ---
function handlePanelClick() {
  if (isAdmin.value) {
    // ADMIN: Przekieruj na ścieżkę zdefiniowaną w routerze (/admin)
    router.push('/admin')
  } else {
    // USER: Przekieruj na ścieżkę panelu użytkownika (/panel)
    router.push('/panel')
  }
}

// Reszta funkcji bez zmian
function openDeposit() { showWalletSelection.value = false; showDeposit.value = true }
function openWithdraw() { showWalletSelection.value = false; showWithdraw.value = true }

onMounted(async () => {
  if (auth.isAuthenticated) await auth.fetchBalance()
})

async function onLoggedIn(payload: { token: string; user: any }) {
  auth.loginSuccess(payload.token, payload.user)
  await auth.fetchBalance()
  showLogin.value = false
}

function handleBalanceChange(amount: number) {
  if (auth.balance !== null) auth.balance += amount
}

function openGameModal(game: { id: string, name: string }) {
  if (!auth.isAuthenticated) { showLogin.value = true; return; }
  if (game.id === 'minesweeper') showMinesweeper.value = true;
  if (game.id === 'slider') showSlider.value = true;
  if (game.id === 'coinflip') showCoinflip.value = true;
  if (game.id === 'roulette') showRoulette.value = true;
  if (game.id === 'slots') showSlots.value = true;
}
// --- Funkcja Losowania Gry ---
function openRandomGame() {
  // 1. Definiujemy listę dostępnych gier (ID muszą pasować do tych w openGameModal)
  const availableGames = [
    { id: 'slots', name: 'Slots' },
    { id: 'minesweeper', name: 'Minesweeper' },
    { id: 'slider', name: 'Slider' },
    { id: 'coinflip', name: 'Coin Flip' },
    { id: 'roulette', name: 'Roulette' }
  ];

  // 2. Losujemy indeks od 0 do liczby gier
  const randomIndex = Math.floor(Math.random() * availableGames.length);
  const randomGame = availableGames[randomIndex];

  // 3. Otwieramy wylosowaną grę używając istniejącej funkcji
  console.log("🎲 Wylosowano grę:", randomGame.name);
  openGameModal(randomGame);
}
</script>