<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" @click="!isProcessing && $emit('close')"></div>

    <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(184,79,246,0.15)] transition-all">

      <div class="flex items-center justify-between border-b border-white/10 p-6">
        <h2 class="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">credit_card</span> Deposit Funds
        </h2>
        <button @click="$emit('close')" :disabled="isProcessing" class="text-white/50 hover:text-white transition-colors disabled:opacity-0">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="p-6">

        <div v-if="!isProcessing && !isSuccess">

          <div v-if="savedCard" class="mb-6">
            <div
                @click="useSavedCard = !useSavedCard"
                class="p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between"
                :class="useSavedCard ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-white/10 bg-white/5 hover:bg-white/10'"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl text-white">credit_card</span>
                <div>
                  <div class="font-bold text-white text-sm">Saved Card ending in {{ savedCard.last4 }}</div>
                  <div class="text-xs text-white/50 uppercase">{{ savedCard.brand }}</div>
                </div>
              </div>
              <div class="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center" :class="{'bg-primary border-primary': useSavedCard}">
                <span v-if="useSavedCard" class="material-symbols-outlined text-black text-sm font-bold">check</span>
              </div>
            </div>
          </div>

          <div v-if="!useSavedCard">
            <div class="mb-6 relative h-48 w-full rounded-xl bg-gradient-to-br from-[#6b21a8] to-[#1e3a8a] p-6 text-white shadow-xl border-t border-white/20 overflow-hidden transform transition-transform hover:scale-[1.02]">
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>

              <div class="relative z-10 h-full flex flex-col justify-between">
                <div class="flex justify-between items-start">
                  <div class="h-8 w-12 rounded bg-yellow-500/80 shadow-md"></div>
                  <div class="font-bold italic text-white/80">VISA</div>
                </div>

                <div class="font-mono text-xl tracking-widest text-shadow-md">
                  {{ formattedCardNumber || '•••• •••• •••• ••••' }}
                </div>

                <div class="flex justify-between items-end">
                  <div class="flex flex-col">
                    <span class="text-[9px] uppercase text-white/60 font-bold tracking-wider">Card Holder</span>
                    <span class="font-bold tracking-wider uppercase text-sm truncate max-w-[150px]">{{ cardName || 'YOUR NAME' }}</span>
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="text-[9px] uppercase text-white/60 font-bold tracking-wider">Expires</span>
                    <span class="font-mono font-bold">{{ cardExpiry || 'MM/YY' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs font-bold uppercase text-gray-400 tracking-wider">Card Number</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">payment</span>
                  <input v-model="cardNumber" @input="formatCardNumber" type="text" maxlength="19" placeholder="0000 0000 0000 0000" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-10 pr-4 text-white placeholder-white/20 outline-none focus:border-white/30 font-mono tracking-wide" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-bold uppercase text-gray-400 tracking-wider">Expiry</label>
                  <input v-model="cardExpiry" @input="formatExpiry" type="text" maxlength="5" placeholder="MM/YY" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-center text-white placeholder-white/20 outline-none focus:border-white/30 font-mono" />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-bold uppercase text-gray-400 tracking-wider">CVC</label>
                  <input v-model="cardCvc" type="password" maxlength="3" placeholder="123" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-center text-white placeholder-white/20 outline-none focus:border-white/30 font-mono tracking-widest" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold uppercase text-gray-400 tracking-wider">Cardholder Name</label>
                <input v-model="cardName" type="text" placeholder="JOHN DOE" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-white placeholder-white/20 outline-none focus:border-white/30 uppercase" />
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-1">
            <label class="text-xs font-bold uppercase text-primary tracking-wider">Amount to Deposit ($)</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
              <input v-model.number="amount" type="number" min="5" max="10000" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-8 pr-4 text-white font-mono font-bold focus:border-primary outline-none transition-colors" placeholder="100.00" />
            </div>
            <div class="flex gap-2 mt-2">
              <button type="button" @click="amount = 50" class="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-xs border border-white/10 transition-colors">$50</button>
              <button type="button" @click="amount = 100" class="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-xs border border-white/10 transition-colors">$100</button>
              <button type="button" @click="amount = 500" class="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-xs border border-white/10 transition-colors">$500</button>
            </div>
          </div>

          <button
              @click="handleDeposit"
              :disabled="!canSubmit"
              class="w-full mt-6 bg-green-500 hover:bg-green-600 text-black font-black py-4 rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform active:scale-95"
          >
            Pay ${{ amount }}
          </button>

        </div>

        <div v-else-if="isProcessing" class="flex flex-col items-center justify-center py-10 space-y-6">
          <div class="relative w-24 h-24 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div class="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

            <span class="material-symbols-outlined text-3xl text-white/50 animate-pulse leading-none relative z-10">lock</span>
          </div>
          <div class="text-center">
            <h3 class="text-xl font-bold text-white mb-1">Processing Payment...</h3>
            <p class="text-sm text-white/50">Contacting bank secure gateway</p>
          </div>
        </div>

        <div v-else-if="isSuccess" class="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in duration-300">
          <div class="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <span class="material-symbols-outlined text-5xl text-green-500 leading-none">check</span>
          </div>
          <div class="text-center">
            <h3 class="text-2xl font-black text-white mb-1">Payment Successful!</h3>
            <p class="text-green-400 font-mono text-lg">+${{ amount.toFixed(2) }} added to wallet</p>
          </div>
          <button @click="$emit('close')" class="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL || ''

// Stan formularza
const amount = ref(100)
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const cardName = ref('')

// Obsługa zapisanej karty
const savedCard = ref<{last4: string, brand: string} | null>(null)
const useSavedCard = ref(false)

// Stan UI
const isProcessing = ref(false)
const isSuccess = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('user_card')
  if (stored) {
    savedCard.value = JSON.parse(stored)
    useSavedCard.value = true
  }
})

const canSubmit = computed(() => {
  if (amount.value <= 0) return false
  if (useSavedCard.value && savedCard.value) return true

  return cardNumber.value.length === 19 &&
      cardExpiry.value.length === 5 &&
      cardCvc.value.length === 3 &&
      cardName.value.length > 2
})

const formattedCardNumber = computed(() => cardNumber.value)

function formatCardNumber(e: Event) {
  let val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  val = val.substring(0, 16)
  let formatted = val.match(/.{1,4}/g)?.join(' ') || val
  cardNumber.value = formatted
}

function formatExpiry(e: Event) {
  let val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  if (val.length >= 2) {
    val = val.substring(0, 2) + '/' + val.substring(2, 4)
  }
  cardExpiry.value = val
}

async function handleDeposit() {
  if (!canSubmit.value) return

  isProcessing.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))

  try {
    const res = await fetch(`${API}/api/wallet/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({ amount: amount.value })
    })

    if (!res.ok) throw new Error('Transaction failed')

    if (!useSavedCard.value) {
      const last4 = cardNumber.value.slice(-4)
      const brand = cardNumber.value.startsWith('4') ? 'Visa' : 'MasterCard'
      const cardData = { last4, brand }
      localStorage.setItem('user_card', JSON.stringify(cardData))
      savedCard.value = cardData
    }

    await auth.fetchBalance()
    isProcessing.value = false
    isSuccess.value = true

  } catch (e) {
    console.error(e)
    alert("Transaction Failed. Try again.")
    isProcessing.value = false
  }
}
</script>

<style scoped>
.text-shadow-md {
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
}
</style>