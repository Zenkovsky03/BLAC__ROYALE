<script setup>
import HeaderComponent from './components/HeaderComponent.vue'
import HeaderComponentWithBalance from './components/HeaderComponentWithBalance.vue'
import HeroSection from './components/HeroSection.vue'
import GamesGrid from './components/GamesGrid.vue'
import LeaderboardSection from './components/LeaderboardSection.vue'
import FooterComponent from './components/FooterComponent.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import DepositModal from './components/DepositModal.vue'
import WithdrawModal from './components/WithdrawModal.vue'
import AccountModal from './components/AccountModal.vue'
import TransactionHistoryModal from './components/TransactionHistoryModal.vue'
import SlotGameModal from './components/SlotGameModal.vue'
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col bg-transparent font-display text-white dark group/design-root">
    <div class="relative layout-container flex h-full grow flex-col">
      <div class="flex flex-1 justify-center">
        <div class="layout-content-container flex w-full max-w-6xl flex-col">
          <!-- Header -->
          <HeaderComponent />

<!--          <HeaderComponentWithBalance/>-->

          <!-- Main content -->
          <main class="flex flex-col gap-10 py-10 md:gap-16 md:py-16">
            <!-- Hero Section -->
<!--            <HeroSection/>-->

            <!-- Games Section -->
            <GamesGrid/>

            <!-- Leaderboard Section -->
            <LeaderboardSection />
          </main>

          <!-- Footer -->

        </div>

      </div>
      <FooterComponent />
    </div>

    <!-- Modals -->
    <LoginModal/>

    <RegisterModal/>

    <DepositModal/>

    <WithdrawModal/>

    <AccountModal/>

    <TransactionHistoryModal/>

    <SlotGameModal/>
  </div>
</template>

<style>
/* Import global styles */
@import '../assets/main.css';
</style>