<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div
        class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        @click="closeModal"
    ></div>

    <div class="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl border border-red-500/50 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] transition-all">

      <button
          @click="closeModal"
          class="absolute right-4 top-4 text-white/30 transition-colors hover:text-white"
      >
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
          <span class="material-symbols-outlined text-3xl text-red-400">payments</span>
        </div>
        <h2 class="text-2xl font-black uppercase tracking-widest text-white">
          Withdraw Funds
        </h2>
        <p class="mt-2 text-sm text-secondary/80">Cash out your winnings to your account</p>
      </div>

      <div class="space-y-6">

        <div class="flex justify-between items-center text-sm">
          <span class="text-white/60">Available Balance:</span>
          <span class="font-mono font-bold text-white">{{ auth.balance ?? 0 }}$</span>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="text-xs font-bold uppercase tracking-wider text-red-400">Amount ($)</label>
            <span v-if="errorMsg" class="text-xs font-bold text-red-500 animate-pulse">{{ errorMsg }}</span>
          </div>

          <div class="relative group">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-white/50 group-focus-within:text-red-400 transition-colors">$</span>

            <input
                v-model="amount"
                type="number"
                min="1"
                :max="auth.balance ?? 0"
                placeholder="0.00"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-10 pr-20 text-2xl font-bold text-white placeholder-white/20 outline-none transition-all focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            />

            <button
                @click="setAmountMax"
                class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
            >
              MAX
            </button>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2">
          <button
              v-for="pct in [25, 50, 75, 100]"
              :key="pct"
              @click="setAmountPercent(pct)"
              class="rounded-lg border border-white/5 bg-white/5 py-2 text-xs font-bold text-white transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-400"
          >
            {{ pct }}%
          </button>
        </div>

        <button
            @click="handleWithdraw"
            :disabled="isLoading || !isValid"
            class="group relative w-full overflow-hidden rounded-xl bg-red-600 py-4 font-bold uppercase tracking-widest text-white transition-all hover:bg-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading" class="relative z-10 flex items-center justify-center gap-2">
            Confirm Withdrawal
            <span class="material-symbols-outlined">arrow_forward</span>
          </span>
          <span v-else class="relative z-10 flex items-center justify-center gap-2">
            Processing...
          </span>
        </button>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const auth = useAuthStore()

const amount = ref<number | null>(null)
const isLoading = ref(false)
const errorMsg = ref('')

const isValid = computed(() => {
  const val = amount.value
  const balance = auth.balance ?? 0
  if (!val || val <= 0) return false
  if (val > balance) return false
  return true
})

const closeModal = () => {
  emit('close')
  amount.value = null
  errorMsg.value = ''
}

// Funkcja ustawiająca MAX
const setAmountMax = () => {
  amount.value = auth.balance ?? 0
}

// Funkcja ustawiająca procenty (np. 50% salda)
const setAmountPercent = (percent: number) => {
  const balance = auth.balance ?? 0
  amount.value = Math.floor(balance * (percent / 100))
}

async function handleWithdraw() {
  errorMsg.value = ''
  if (!amount.value || amount.value <= 0) return

  // Sprawdzenie frontendowe (dla szybkości)
  if (amount.value > (auth.balance ?? 0)) {
    errorMsg.value = 'Insufficient funds!'
    return
  }

  isLoading.value = true
  const base = import.meta.env.VITE_API_URL || ''

  try {
    const res = await fetch(`${base}/api/wallet/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({ amount: amount.value })
    })

    if (res.ok) {
      // 1. Odśwież saldo
      await auth.fetchBalance()

      // 2. Sukces
      alert(`Successfully withdrew $${amount.value}!`)
      closeModal()
    } else {
      const err = await res.json()
      errorMsg.value = err.message || 'Withdrawal failed'
    }
  } catch (error) {
    console.error(error)
    errorMsg.value = 'Network error'
  } finally {
    isLoading.value = false
  }
}
</script>