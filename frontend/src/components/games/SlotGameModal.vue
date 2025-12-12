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
                 :class="lastResult.includes('won') ? 'text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'text-white/50'">
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

        <div class="w-full mt-4 border-t border-white/10 pt-6">
          <details class="group rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all open:border-primary/50 open:shadow-[0_0_20px_rgba(184,79,246,0.2)]">
            <summary class="flex cursor-pointer items-center justify-between p-4 font-bold text-white hover:bg-white/5 select-none transition-colors">
              <div class="flex items-center gap-2 text-lg uppercase tracking-wider">
                <span class="material-symbols-outlined text-primary">info</span>
                How to Play
              </div>
              <span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
            </summary>

            <div class="p-6 pt-2 text-secondary/90 space-y-4 bg-black/40">
              <div class="flex gap-4 items-start">
                <div class="bg-primary/20 p-2 rounded-lg text-primary"><span class="material-symbols-outlined">payments</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">1. Place Bet</h4>
                  <p class="text-sm">Choose your bet amount. Higher bets mean bigger potential jackpots!</p>
                </div>
              </div>
              <div class="flex gap-4 items-start">
                <div class="bg-blue-400/20 p-2 rounded-lg text-blue-400"><span class="material-symbols-outlined">rotate_right</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">2. Spin</h4>
                  <p class="text-sm">Click SPIN to rotate the reels. Match 3 symbols on the center line to win.</p>
                </div>
              </div>
              <div class="flex gap-4 items-start">
                <div class="bg-green-400/20 p-2 rounded-lg text-green-400"><span class="material-symbols-outlined">emoji_events</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">3. Payouts</h4>
                  <p class="text-sm">
                    🍒 Any Cherry: x0.5 <br>
                    🍒🍒🍒 3 Cherries: x20 <br>
                    🔔🔔🔔 3 Bells: x30 <br>
                    💎💎💎 3 Bars: x50 <br>
                    7️⃣7️⃣7️⃣ 3 Sevens: <strong>x100 Jackpot!</strong>
                  </p>
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

// DOM Refs
const reel1 = ref(null)
const reel2 = ref(null)
const reel3 = ref(null)

// --- CONFIG ---
const iconMap = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "melon"]
const ICON_HEIGHT = 100 // Wysokość ikony w pikselach (musi pasować do CSS)

const displayBalance = computed(() => (props.balance ?? 0).toFixed(2))

// --- HELPERS ---
const getIconContent = (iconName) => {
  const icons = {
    'banana': '🍌', 'seven': '7️⃣', 'cherry': '🍒', 'plum': '🍇',
    'orange': '🍊', 'bell': '🔔', 'bar': '💎', 'lemon': '🍋', 'melon': '🍉'
  }
  return icons[iconName] || '?'
}

const getIconStyle = (iconName) => {
  if (iconName === 'seven') return { color: '#f900ff', textShadow: '0 0 10px #f900ff' }
  if (iconName === 'bar') return { color: '#00f6ff', textShadow: '0 0 10px #00f6ff' }
  return {}
}

const getRandomIcon = () => iconMap[Math.floor(Math.random() * iconMap.length)]

const initReels = () => {
  for (let r = 0; r < 3; r++) {
    reelIcons.value[r] = []
    // Generujemy 20 ikon na start, żeby było co kręcić
    for (let i = 0; i < 20; i++) {
      reelIcons.value[r].push(getRandomIcon())
    }
  }
}

// --- LOGIC ---
const spinReel = async (reelIndex) => {
  const reelRef = [reel1.value, reel2.value, reel3.value][reelIndex]
  if (!reelRef) return 0 // Zabezpieczenie

  const track = reelRef.querySelector('.reel-track')

  // 1. Dodaj nowe ikony na górę, żeby animacja była płynna
  const currentIcons = reelIcons.value[reelIndex]
  const newIcons = Array.from({length: 20}, () => getRandomIcon())

  // Reset pozycji (szybki powrót do góry bez animacji)
  track.style.transition = 'none'
  track.style.transform = 'translateY(0)'

  // Podmieniamy ikony na nowe
  reelIcons.value[reelIndex] = newIcons

  // Wymuszenie reflow (ważne dla resetu CSS)
  void track.offsetWidth

  // 2. Oblicz pozycję końcową
  // Chcemy zatrzymać się tak, żeby 2. ikona (indeks 1) była na środku.
  // Ale ponieważ translate przesuwa w górę (-Y), musimy przesunąć o:
  // (Liczba ikon - Ilość widocznych na ekranie + margines) * wysokość
  // Prościej: Przesuwamy o np. 15 pozycji w dół.
  const stopIndex = 15 // Zatrzymaj na 15. ikonie
  const translateY = stopIndex * ICON_HEIGHT

  // 3. Start Animacji
  // Czas zależny od bębna (żeby zatrzymywały się po kolei)
  const duration = 1500 + (reelIndex * 500)

  track.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0.9, 0.3, 1)` // Easing "z hamowaniem"
  track.style.transform = `translateY(-${translateY}px)`

  return new Promise((resolve) => {
    setTimeout(() => {
      // Zwracamy ikonę, która zatrzymała się na środku (na linii)
      // Jeśli przesunęliśmy o 'stopIndex' * wysokość, to na górze widocznego okna jest ikona o indeksie 'stopIndex'.
      // Ale okno wyświetla 3 ikony, a linia jest na środku (druga pozycja).
      // Więc wygrywająca ikona to stopIndex + 1.
      const winningIcon = newIcons[stopIndex + 1]
      const winningIndex = iconMap.indexOf(winningIcon)
      resolve(winningIndex)
    }, duration)
  })
}

const spin = async () => {
  if (isSpinning.value || props.balance < betAmount.value) return

  isSpinning.value = true
  lastResult.value = ''
  emit('balanceChange', -betAmount.value)

  // Startujemy bębny
  const promises = [0, 1, 2].map(i => spinReel(i))

  // Czekamy na wyniki
  const results = await Promise.all(promises)

  // Obliczamy wygraną
  const winnings = calculateWinnings(results)

  if (winnings > 0) {
    emit('balanceChange', winnings)
    lastResult.value = `🎉 BIG WIN! YOU WON $${winnings}!`
  } else {
    lastResult.value = 'NO LUCK. TRY AGAIN!'
  }

  isSpinning.value = false
}

const calculateWinnings = (results) => {
  const [i1, i2, i3] = results
  const bet = betAmount.value

  // 1. Trzy takie same
  if (i1 === i2 && i2 === i3) {
    const symbol = iconMap[i1]
    const multipliers = {
      'seven': 100, // Jackpot
      'bar': 50,
      'bell': 30,
      'cherry': 20,
      'default': 10
    }
    return bet * (multipliers[symbol] || multipliers['default'])
  }

  // 2. Dwa takie same
  if (i1 === i2 || i2 === i3 || i1 === i3) {
    return bet * 2
  }

  // 3. Jakakolwiek wiśnia (Cherry = indeks 2)
  if (results.includes(2)) {
    return bet * 0.5 // Zwrot połowy
  }

  return 0
}

onMounted(() => {
  initReels()
})
</script>

<style scoped>
/* --- CUSTOM SCROLLBAR --- */
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(184, 79, 246, 0.3); border-radius: 10px; }

/* --- NEON TEXT --- */
.neon-text-glow { text-shadow: 0 0 15px rgba(184, 79, 246, 0.7); }

/* --- CONTROLS --- */
.setting-group { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
.setting-label { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #fff; text-transform: uppercase; font-size: 0.85rem; }
.select-wrapper { position: relative; background: rgba(0,0,0,0.4); border-radius: 0.75rem; overflow: hidden; width: 100%; }
.neon-border-blue { border: 1px solid rgba(0, 246, 255, 0.5); box-shadow: 0 0 15px rgba(0, 246, 255, 0.2) inset; }
.setting-select { width: 100%; background: transparent; color: #fff; padding: 1rem; font-size: 1.1rem; font-weight: bold; outline: none; appearance: none; cursor: pointer; }

.digital-readout .label { font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.5); display: block; text-align: center; }
.digital-readout .value { font-family: monospace; font-size: 1.2rem; font-weight: 700; text-shadow: 0 0 10px currentColor; }

.cyber-button-start {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 2rem;
  font-weight: 800; text-transform: uppercase; border-radius: 0.75rem;
  background: linear-gradient(90deg, #00f6ff, #b84ff6); color: #0a0a0a; font-size: 1.2rem;
  box-shadow: 0 0 25px rgba(184, 79, 246, 0.5); transition: all 0.3s;
}
.cyber-button-start:not(:disabled):hover { transform: scale(1.02); box-shadow: 0 0 40px rgba(184, 79, 246, 0.8); }

/* --- SLOT MACHINE FRAME --- */
.slot-machine-frame {
  position: relative;
  background: #111;
  padding: 10px;
  border-radius: 20px;
  border: 4px solid #b84ff6;
  box-shadow: 0 0 40px rgba(184, 79, 246, 0.3);
  width: 100%;
  max-width: 500px;
}

.slots-window {
  display: flex;
  height: 300px; /* 3 ikony x 100px */
  background: #000;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.reel {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, #000 0%, #1a1a1a 50%, #000 100%);
}

.reel-track {
  display: flex;
  flex-direction: column;
  /* Transform animowany w JS */
}

.slot-icon {
  height: 100px; /* Musi pasować do ICON_HEIGHT w JS */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));
}

.winning-line {
  position: absolute;
  top: 50%; left: 0; right: 0;
  height: 4px;
  background: rgba(255, 0, 0, 0.6);
  box-shadow: 0 0 10px red;
  transform: translateY(-50%);
  z-index: 10;
  pointer-events: none;
}

.slot-header-bar, .slot-footer-bar {
  height: 10px;
  background: linear-gradient(90deg, #333, #666, #333);
  border-radius: 5px;
  margin: 5px 0;
}
</style>