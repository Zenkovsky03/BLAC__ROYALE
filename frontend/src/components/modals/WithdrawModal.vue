<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" @click="!isProcessing && $emit('close')"></div>

    <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(184,79,246,0.15)]">

      <div class="flex items-center justify-between border-b border-white/10 p-6">
        <h2 class="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-red-500">output</span> Withdraw Funds
        </h2>
        <button @click="$emit('close')" :disabled="isProcessing" class="text-white/50 hover:text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="p-6">
        <div v-if="!isProcessing && !isSuccess">
          <p class="text-sm text-white/60 mb-6">Select a destination for your funds.</p>

          <div class="space-y-3 mb-6">
            <label class="text-xs font-bold uppercase text-gray-400 tracking-wider">Withdraw to</label>

            <div
                v-if="savedCard"
                class="p-4 rounded-xl border border-primary/50 bg-primary/10 flex items-center justify-between cursor-pointer ring-1 ring-primary"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl text-white">credit_card</span>
                <div>
                  <div class="font-bold text-white text-sm">{{ savedCard.brand }} ending in {{ savedCard.last4 }}</div>
                  <div class="text-xs text-white/50">Instant Transfer</div>
                </div>
              </div>
              <span class="material-symbols-outlined text-primary">check_circle</span>
            </div>

            <div v-else class="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
              <p class="text-sm text-red-300 font-bold mb-1">No saved card found</p>
              <p class="text-xs text-white/50">Please make a deposit first to save a card.</p>
            </div>
          </div>

          <form @submit.prevent="handleWithdraw" class="space-y-6">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase text-red-400 tracking-wider">Amount to Withdraw</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                <input v-model.number="amount" type="number" :max="auth.balance || 0" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-8 pr-4 text-white font-mono font-bold focus:border-red-500 outline-none" placeholder="0.00" />
              </div>
              <div class="text-right text-xs text-white/40">Available: ${{ auth.balance?.toFixed(2) }}</div>
            </div>

            <button type="submit" :disabled="amount <= 0 || amount > (auth.balance || 0) || !savedCard" class="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Confirm Withdraw
            </button>
          </form>
        </div>

        <div v-else-if="isProcessing" class="flex flex-col items-center justify-center py-10 space-y-6">
          <span class="material-symbols-outlined text-5xl text-red-500 animate-bounce">savings</span>
          <div class="text-center">
            <h3 class="text-xl font-bold text-white">Processing Request...</h3>
            <p class="text-sm text-white/50">Sending funds to {{ savedCard?.brand }} **** {{ savedCard?.last4 }}</p>
          </div>
        </div>

        <div v-else-if="isSuccess" class="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in duration-300">
          <div class="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500">
            <span class="material-symbols-outlined text-5xl text-red-500">done_all</span>
          </div>
          <div class="text-center">
            <h3 class="text-2xl font-black text-white">Withdrawal Sent!</h3>
            <p class="text-white/60">Funds are on the way to your card.</p>
          </div>
          <button @click="$emit('close')" class="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold">Close</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL || ''

const amount = ref(0)
const isProcessing = ref(false)
const isSuccess = ref(false)
const savedCard = ref<{last4: string, brand: string} | null>(null)

onMounted(() => {
  const stored = localStorage.getItem('user_card')
  if (stored) {
    savedCard.value = JSON.parse(stored)
  }
})

async function handleWithdraw() {
  if (amount.value <= 0 || !savedCard.value) return
  isProcessing.value = true
  await new Promise(r => setTimeout(r, 2000))

  try {
    const res = await fetch(`${API}/api/wallet/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
      body: JSON.stringify({ amount: amount.value })
    })
    if (!res.ok) throw new Error('Failed')

    await auth.fetchBalance()
    isProcessing.value = false
    isSuccess.value = true
  } catch (e) {
    isProcessing.value = false
    alert("Withdraw failed (Insufficient funds?)")
  }
}
</script>