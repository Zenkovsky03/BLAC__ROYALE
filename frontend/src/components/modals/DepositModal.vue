<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div
        class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        @click="closeModal"
    ></div>

    <div class="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl border border-green-500/50 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(34,197,94,0.2)] transition-all">

      <button
          @click="closeModal"
          class="absolute right-4 top-4 text-white/30 transition-colors hover:text-white"
      >
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <span class="material-symbols-outlined text-3xl text-green-400">add_card</span>
        </div>
        <h2 class="text-2xl font-black uppercase tracking-widest text-white">
          Deposit Funds
        </h2>
        <p class="mt-2 text-sm text-secondary/80">Securely add money to your balance</p>
      </div>

      <div class="space-y-6">

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-green-400">Amount ($)</label>
          <div class="relative group">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-white/50 group-focus-within:text-green-400 transition-colors">$</span>
            <input
                v-model="amount"
                type="number"
                min="1"
                placeholder="0.00"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-10 pr-4 text-2xl font-bold text-white placeholder-white/20 outline-none transition-all focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2">
          <button
              v-for="val in [50, 100, 500, 1000]"
              :key="val"
              @click="amount = val"
              class="rounded-lg border border-white/5 bg-white/5 py-2 text-xs font-bold text-white transition-all hover:border-green-500/50 hover:bg-green-500/20 hover:text-green-400"
          >
            +${{ val }}
          </button>
        </div>

        <button
            @click="handleDeposit"
            :disabled="isLoading || amount <= 0"
            class="group relative w-full overflow-hidden rounded-xl bg-green-600 py-4 font-bold uppercase tracking-widest text-white transition-all hover:bg-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading" class="relative z-10 flex items-center justify-center gap-2">
            Confirm Deposit
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
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const auth = useAuthStore()

const amount = ref<number | null>(null)
const isLoading = ref(false)

const closeModal = () => {
  emit('close')
  amount.value = null
}

async function handleDeposit() {
  if (!amount.value || amount.value <= 0) return

  isLoading.value = true
  const base = import.meta.env.VITE_API_URL || ''

  try {
    const res = await fetch(`${base}/api/wallet/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({ amount: amount.value })
    })

    if (res.ok) {
      await auth.fetchBalance()

      alert(`Successfully added $${amount.value}!`)
      closeModal()
    } else {
      const err = await res.json()
      alert('Error: ' + (err.message || 'Deposit failed'))
    }
  } catch (error) {
    console.error(error)
    alert('Network error')
  } finally {
    isLoading.value = false
  }
}
</script>