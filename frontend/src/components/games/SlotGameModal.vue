<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all">
    <div class="relative my-8 flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-2 border-primary/50 bg-[#0a0a0a]/95 p-6 shadow-[0_0_60px_-15px_rgba(184,79,246,0.6)] md:p-10">

      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-4xl">🎰</span>
          <h2 class="text-3xl font-black uppercase tracking-wider text-white neon-text-glow">
            Cyber Slots
          </h2>
        </div>
        <button @click="$emit('close')" class="group rounded-full bg-white/5 p-2 transition-all hover:bg-red-500/20">
          <span class="material-symbols-outlined text-white/70 transition-colors group-hover:text-red-400">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-8 items-center">
        <div class="w-full flex flex-col items-center gap-8">

          <div class="grid grid-cols-2 gap-4 items-end w-full max-w-md">
            <div class="setting-group">
              <label class="setting-label"><span class="material-symbols-outlined text-sm">payments</span> Bet Amount:</label>
              <div class="select-wrapper neon-border-blue">
                <select v-model="betAmount" class="setting-select" :disabled="isSpinning">
                  <option :value="10">$10</option>
                  <option :value="25">$25</option>
                  <option :value="50">$50</option>
                  <option :value="100">$100</option>
                </select>
              </div>
            </div>

            <div class="digital-readout bg-black/40 p-3 rounded-xl border border-white/10 h-[58px] flex justify-center">
              <span class="label">BALANCE</span>
              <span class="value text-green-400">${{ displayBalance }}</span>
            </div>
          </div>

          <div class="slot-machine-frame">
            <div class="slot-header-bar"></div>
            <div class="slots-window">
              <div class="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border-y-4 border-black/50"></div>
              <div class="winning-line"></div>

              <div class="reel" ref="reel1">
                <div class="reel-track">
                  <div v-for="(icon, idx) in reelIcons[0]" :key="'r1-'+idx" class="slot-icon" :style="getIconStyle(icon)">
                    {{ getIconContent(icon) }}
                  </div>
                </div>
              </div>
              <div class="reel border-x border-white/10" ref="reel2">
                <div class="reel-track">
                  <div v-for="(icon, idx) in reelIcons[1]" :key="'r2-'+idx" class="slot-icon" :style="getIconStyle(icon)">
                    {{ getIconContent(icon) }}
                  </div>
                </div>
              </div>
              <div class="reel" ref="reel3">
                <div class="reel-track">
                  <div v-for="(icon, idx) in reelIcons[2]" :key="'r3-'+idx" class="slot-icon" :style="getIconStyle(icon)">
                    {{ getIconContent(icon) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="slot-footer-bar"></div>
          </div>

          <div class="h-8 flex items-center justify-center w-full">
            <div v-if="lastResult"
                 class="text-xl font-black uppercase tracking-widest animate-in fade-in zoom-in duration-300"
                 :class="lastResult.includes('WIN') ? 'text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'text-white/50'">
              {{ lastResult }}
            </div>
          </div>

          <div class="flex flex-col items-center gap-2 w-full max-w-md">
            <button
                @click="spin"
                :disabled="isSpinning || betAmount > (balance || 0)"
                class="cyber-button-start w-full transition-all py-4 text-xl"
                :class="{ 'grayscale opacity-50 cursor-not-allowed': betAmount > (balance || 0) || isSpinning }"
            >
              <span v-if="isSpinning" class="material-symbols-outlined animate-spin text-2xl">sync</span>
              <span v-else class="material-symbols-outlined text-2xl">play_circle</span>
              {{ isSpinning ? 'SPINNING...' : 'SPIN' }}
            </button>
            <div v-if="betAmount > (balance || 0)" class="text-red-500 font-bold uppercase tracking-wider text-xs animate-pulse">
              Insufficient Funds!
            </div>
          </div>

        </div>

        <div class="w-full mt-8 border-t border-white/10 pt-6">
          <details class="group rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all open:border-primary/50 open:shadow-[0_0_20px_rgba(184,79,246,0.2)]">
            <summary class="flex cursor-pointer items-center justify-between p-4 font-bold text-white hover:bg-white/5 select-none transition-colors">
              <div class="flex items-center gap-2 text-lg uppercase tracking-wider">
                <span class="material-symbols-outlined text-primary">info</span>
                How to Play & Payouts
              </div>
              <span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
            </summary>

            <div class="p-6 pt-2 text-secondary/90 space-y-6 bg-black/40">

              <div class="grid md:grid-cols-2 gap-4">
                <div class="flex gap-4 items-start">
                  <div class="bg-primary/20 p-2 rounded-lg text-primary"><span class="material-symbols-outlined">payments</span></div>
                  <div>
                    <h4 class="font-bold text-white mb-1">1. Place Bet</h4>
                    <p class="text-sm text-gray-400">Select your wager amount using the dropdown menu.</p>
                  </div>
                </div>
                <div class="flex gap-4 items-start">
                  <div class="bg-green-400/20 p-2 rounded-lg text-green-400"><span class="material-symbols-outlined">casino</span></div>
                  <div>
                    <h4 class="font-bold text-white mb-1">2. Spin to Win</h4>
                    <p class="text-sm text-gray-400">Match 3 symbols on the payline to win multiplied rewards.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-bold text-white mb-3 text-center uppercase tracking-widest text-xs border-b border-white/10 pb-2">Payout Table (3 Matches)</h4>
                <div class="grid grid-cols-3 gap-2 text-sm text-center">

                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">7️⃣</span>
                    <span class="font-bold text-purple-400">x50</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">⭐</span>
                    <span class="font-bold text-yellow-400">x15</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">🔔</span>
                    <span class="font-bold text-cyan-400">x10</span>
                  </div>

                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">🍉</span>
                    <span class="font-bold text-white">x8</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">🫐</span>
                    <span class="font-bold text-white">x5</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">🍇</span>
                    <span class="font-bold text-white">x4</span>
                  </div>

                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">🍊</span>
                    <span class="font-bold text-white">x3</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">🍋</span>
                    <span class="font-bold text-white">x2</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center">
                    <span class="text-2xl mb-1">🍒</span>
                    <span class="font-bold text-white">x2</span>
                  </div>

                </div>
              </div>

            </div>
          </details>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({ balance: Number })
const emit = defineEmits(['close', 'balanceChange'])

// --- STATE ---
const betAmount = ref(10)
const isSpinning = ref(false)
const lastResult = ref('')
const reelIcons = ref([[], [], []])

// Refs do DOM
const reel1 = ref(null)
const reel2 = ref(null)
const reel3 = ref(null)

// --- KONFIGURACJA SYMBOLI ---
const iconMap = [
  "CHERRY", "LEMON", "ORANGE", "PLUM", "GRAPE", "WATERMELON", "BELL", "STAR", "SEVEN"
]
const ICON_HEIGHT = 100

const displayBalance = computed(() => (props.balance ?? 0).toFixed(2))

// --- WYGLĄD IKON ---
const getIconContent = (iconName) => {
  const icons = {
    'CHERRY': '🍒', 'LEMON': '🍋', 'ORANGE': '🍊', 'PLUM': '🍇',
    'GRAPE': '🫐', 'WATERMELON': '🍉', 'BELL': '🔔', 'STAR': '⭐', 'SEVEN': '7️⃣'
  }
  return icons[iconName] || '❓'
}

const getIconStyle = (iconName) => {
  if (iconName === 'SEVEN') return { color: '#f900ff', textShadow: '0 0 10px #f900ff' }
  if (iconName === 'STAR') return { color: '#ffd700', textShadow: '0 0 10px #ffd700' }
  if (iconName === 'BELL') return { color: '#00f6ff', textShadow: '0 0 10px #00f6ff' }
  return {}
}

const getRandomIcon = () => iconMap[Math.floor(Math.random() * iconMap.length)]

const initReels = () => {
  for (let r = 0; r < 3; r++) {
    reelIcons.value[r] = []
    for (let i = 0; i < 20; i++) {
      reelIcons.value[r].push(getRandomIcon())
    }
  }
}

// --- LOGIKA ANIMACJI ---
const spinReel = async (reelIndex, targetSymbol) => {
  const reelRef = [reel1.value, reel2.value, reel3.value][reelIndex]
  if (!reelRef) return

  const track = reelRef.querySelector('.reel-track')
  const stopIndex = 15
  const winningIndex = stopIndex + 1

  const newIcons = Array.from({length: 20}, () => getRandomIcon())
  newIcons[winningIndex] = targetSymbol

  track.style.transition = 'none'
  track.style.transform = 'translateY(0)'
  reelIcons.value[reelIndex] = newIcons
  void track.offsetWidth

  const translateY = stopIndex * ICON_HEIGHT
  const duration = 1500 + (reelIndex * 500)

  track.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0.9, 0.3, 1)`
  track.style.transform = `translateY(-${translateY}px)`

  return new Promise(resolve => setTimeout(resolve, duration))
}

// --- FUNKCJA SZUKAJĄCA TOKENA ---
const findToken = () => {
  let t = localStorage.getItem('auth_token');
  if (t) return t.replace(/^"|"$/g, '');

  // 2. Fallbacki
  t = localStorage.getItem('token');
  if (t) return t;

  try {
    const userStr = localStorage.getItem('user') || localStorage.getItem('auth_user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      if (userObj.token) return userObj.token;
    }
  } catch (e) {
    console.warn("Błąd parsowania User JSON");
  }

  return null;
}

// --- SPIN ---
const spin = async () => {
  if (isSpinning.value || props.balance < betAmount.value) return

  isSpinning.value = true
  lastResult.value = ''

  const token = findToken();

  if (!token) {
    lastResult.value = "ERROR: Zaloguj się ponownie (Brak tokena)"
    isSpinning.value = false
    return
  }

  try {
    const response = await fetch('http://localhost:8000/api/games/play-slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bet: betAmount.value
      })
    })

    if (!response.ok) {
      if (response.status === 401) throw new Error("Sesja wygasła. Zaloguj się ponownie.");
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Błąd serwera');
    }

    const data = await response.json()

    const promises = [0, 1, 2].map(i => spinReel(i, data.reels[i]))
    await Promise.all(promises)

    if (data.winAmount > data.bet) {
      lastResult.value = `🎉 BIG WIN! WYGRANA: $${data.winAmount}!`
    } else if (data.winAmount > 0) {
      lastResult.value = `WYGRANA: $${data.winAmount}`
    } else {
      lastResult.value = 'SPRÓBUJ PONOWNIE'
    }

    const profit = data.winAmount - data.bet
    emit('balanceChange', profit)

  } catch (error) {
    console.error("Spin error", error)
    lastResult.value = "BŁĄD: " + error.message
  } finally {
    isSpinning.value = false
  }
}

onMounted(() => {
  initReels()
})
</script>

<style scoped>
/* STYLE BEZ ZMIAN */
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(184, 79, 246, 0.3); border-radius: 10px; }
.neon-text-glow { text-shadow: 0 0 15px rgba(184, 79, 246, 0.7); }
.setting-group { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
.setting-label { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #fff; text-transform: uppercase; font-size: 0.85rem; }
.select-wrapper { position: relative; background: rgba(0,0,0,0.4); border-radius: 0.75rem; overflow: hidden; width: 100%; }
.neon-border-blue { border: 1px solid rgba(0, 246, 255, 0.5); box-shadow: 0 0 15px rgba(0, 246, 255, 0.2) inset; }
.setting-select { width: 100%; background: transparent; color: #fff; padding: 1rem; font-size: 1.1rem; font-weight: bold; outline: none; appearance: none; cursor: pointer; }
.digital-readout .label { font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.5); display: block; text-align: center; }
.digital-readout .value { font-family: monospace; font-size: 1.2rem; font-weight: 700; text-shadow: 0 0 10px currentColor; }
.cyber-button-start { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 2rem; font-weight: 800; text-transform: uppercase; border-radius: 0.75rem; background: linear-gradient(90deg, #00f6ff, #b84ff6); color: #0a0a0a; font-size: 1.2rem; box-shadow: 0 0 25px rgba(184, 79, 246, 0.5); transition: all 0.3s; }
.cyber-button-start:not(:disabled):hover { transform: scale(1.02); box-shadow: 0 0 40px rgba(184, 79, 246, 0.8); }
.slot-machine-frame { position: relative; background: #111; padding: 10px; border-radius: 20px; border: 4px solid #b84ff6; box-shadow: 0 0 40px rgba(184, 79, 246, 0.3); width: 100%; max-width: 500px; }
.slots-window { display: flex; height: 300px; background: #000; border-radius: 10px; overflow: hidden; position: relative; }
.reel { flex: 1; overflow: hidden; position: relative; background: linear-gradient(90deg, #000 0%, #1a1a1a 50%, #000 100%); }
.reel-track { display: flex; flex-direction: column; }
.slot-icon { height: 100px; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
.winning-line { position: absolute; top: 50%; left: 0; right: 0; height: 4px; background: rgba(255, 0, 0, 0.6); box-shadow: 0 0 10px red; transform: translateY(-50%); z-index: 10; pointer-events: none; }
.slot-header-bar, .slot-footer-bar { height: 10px; background: linear-gradient(90deg, #333, #666, #333); border-radius: 5px; margin: 5px 0; }
</style>