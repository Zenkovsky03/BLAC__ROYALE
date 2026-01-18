<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" @click="!isProcessing && $emit('close')"></div>

    <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(184,79,246,0.15)]">

      <div class="flex items-center justify-between border-b border-white/10 p-6">
        <h2 class="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-red-500">output</span> Withdraw Funds
        </h2>
        <button @click="$emit('close')" :disabled="isProcessing" class="text-white/50 hover:text-white transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="p-6">
        <div v-if="!isProcessing && !isSuccess">

          <div class="mb-6">
            <label class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 block">Destination</label>

            <div v-if="savedCard" class="mb-6">
              <div
                  @click="useSavedCard = !useSavedCard"
                  class="p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group"
                  :class="useSavedCard ? 'border-red-500 bg-red-500/10 ring-1 ring-red-500' : 'border-white/10 bg-white/5 hover:bg-white/10'"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-2xl text-white">credit_card</span>
                  <div>
                    <div class="font-bold text-white text-sm">Saved {{ savedCard.brand }} ending {{ savedCard.last4 }}</div>
                    <div class="text-xs text-white/50 group-hover:text-white/70">Click to change</div>
                  </div>
                </div>
                <div class="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center transition-colors" :class="{'bg-red-500 border-red-500': useSavedCard}">
                  <span v-if="useSavedCard" class="material-symbols-outlined text-black text-sm font-bold">check</span>
                </div>
              </div>
            </div>

            <div v-if="!useSavedCard" class="animate-in fade-in slide-in-from-top-2 duration-300">

              <div class="mb-6 relative h-48 w-full rounded-xl bg-gradient-to-br from-[#7f1d1d] to-[#be123c] p-6 text-white shadow-xl border-t border-white/20 overflow-hidden transform transition-transform hover:scale-[1.02]">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/20 rounded-full blur-xl"></div>

                <div class="relative z-10 h-full flex flex-col justify-between">
                  <div class="flex justify-between items-start">
                    <div class="h-8 w-12 rounded bg-yellow-500/80 shadow-md"></div>
                    <div class="font-bold italic text-white/80">VISA</div>
                  </div>

                  <div class="font-mono text-xl tracking-widest text-shadow-md">
                    {{ cardNumber || '•••• •••• •••• ••••' }}
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
                  <label class="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Card Number</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">payment</span>
                    <input v-model="cardNumber" @input="formatCardNumber" type="text" maxlength="19" placeholder="0000 0000 0000 0000" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-10 pr-4 text-white placeholder-white/20 outline-none focus:border-red-500 font-mono tracking-wide transition-colors" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Expiry</label>
                    <input v-model="cardExpiry" @input="formatExpiry" type="text" maxlength="5" placeholder="MM/YY" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-center text-white placeholder-white/20 outline-none focus:border-red-500 font-mono transition-colors" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase text-gray-500 tracking-wider">CVC</label>
                    <input v-model="cardCvc" type="password" maxlength="3" placeholder="123" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-center text-white placeholder-white/20 outline-none focus:border-red-500 font-mono tracking-widest transition-colors" />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Cardholder Name</label>
                  <input v-model="cardName" type="text" placeholder="JOHN DOE" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-white placeholder-white/20 outline-none focus:border-red-500 uppercase transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6 mt-8 border-t border-white/10 pt-6">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase text-red-400 tracking-wider">Amount to Withdraw</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                <input v-model.number="amount" type="number" :max="auth.balance || 0" class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-8 pr-4 text-white font-mono font-bold focus:border-red-500 outline-none transition-colors" placeholder="0.00" />
              </div>
              <div class="flex justify-between text-xs mt-1">
                <span class="text-white/40">Min: $10.00</span>
                <span class="text-white/40">Available: <span class="text-green-400">${{ auth.balance?.toFixed(2) }}</span></span>
              </div>
            </div>

            <button
                @click="handleWithdraw"
                :disabled="!canSubmit"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform active:scale-[0.98]"
            >
              Confirm Withdraw
            </button>
          </div>
        </div>

        <div v-else-if="isProcessing" class="flex flex-col items-center justify-center py-10 space-y-6">
          <span class="material-symbols-outlined text-5xl text-red-500 animate-bounce leading-none">savings</span>
          <div class="text-center">
            <h3 class="text-xl font-bold text-white">Processing Request...</h3>
            <p class="text-sm text-white/50">Sending funds to external account...</p>
          </div>
        </div>

        <div v-else-if="isSuccess" class="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in duration-300">
          <div class="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500">
            <span class="material-symbols-outlined text-5xl text-red-500 leading-none">check</span>
          </div>
          <div class="text-center">
            <h3 class="text-2xl font-black text-white">Withdrawal Sent!</h3>
            <p class="text-white/60">Funds are on the way to your card.</p>
          </div>
          <button @click="$emit('close')" class="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">Close</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL || ''

const amount = ref(0)
const savedCard = ref<{last4: string, brand: string} | null>(null)
const useSavedCard = ref(false)

const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const cardName = ref('')

const isProcessing = ref(false)
const isSuccess = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('user_card')
  if (stored) {
    savedCard.value = JSON.parse(stored)
    useSavedCard.value = true
  } else {
    useSavedCard.value = false
  }
})

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

const canSubmit = computed(() => {
  if (amount.value <= 0) return false
  if (amount.value > (auth.balance || 0)) return false

  if (useSavedCard.value && savedCard.value) return true

  return cardNumber.value.length === 19 &&
      cardExpiry.value.length === 5 &&
      cardCvc.value.length === 3 &&
      cardName.value.length > 2
})

async function handleWithdraw() {
  if (!canSubmit.value) return

  isProcessing.value = true
  await new Promise(r => setTimeout(r, 2000))

  try {
    const res = await fetch(`${API}/api/wallet/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
      body: JSON.stringify({ amount: amount.value })
    })

    if (!res.ok) throw new Error('Withdrawal failed')

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
    isProcessing.value = false
    alert("Withdraw failed (Insufficient funds or server error)")
  }
}
</script>

<style scoped>
.text-shadow-md {
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
}
</style>