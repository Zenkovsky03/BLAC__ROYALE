<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all">

    <div class="relative my-8 flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-primary/50 bg-[#0a0a0a]/95 p-6 shadow-[0_0_60px_-15px_rgba(184,79,246,0.6)] md:p-10">

      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-4xl">🪙</span>
          <div class="flex flex-col">
            <h2 class="text-3xl font-black uppercase tracking-wider text-white neon-text-glow">
              Cyber Coinflip
            </h2>
            <span v-if="isTestMode" class="text-xs text-yellow-400 font-mono uppercase tracking-wider">
              🧪 TEST MODE
            </span>
          </div>
        </div>
        <button @click="$emit('close')" class="group rounded-full bg-white/5 p-2 transition-all hover:bg-red-500/20">
          <span class="material-symbols-outlined text-white/70 transition-colors group-hover:text-red-400">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">

        <div class="flex flex-col gap-8">

          <div class="grid grid-cols-2 gap-4 items-end">
            <div class="setting-group">
              <label class="setting-label"><span class="material-symbols-outlined text-sm">payments</span> Bet Amount:</label>
              <div class="select-wrapper neon-border-blue">
                <select v-model="betAmount" class="setting-select" :disabled="isFlipping">
                  <option :value="5">$5</option>
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

          <div class="setting-group">
            <label class="setting-label justify-center w-full mb-2">CHOOSE YOUR SIDE</label>
            <div class="grid grid-cols-2 gap-4">
              <button
                  @click="selectedSide = 'heads'"
                  :disabled="isFlipping"
                  class="side-btn group"
                  :class="{ 'active-heads': selectedSide === 'heads' }"
              >
                <div class="relative z-10 flex flex-col items-center gap-2">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-lg flex items-center justify-center font-black text-black text-xl">H</div>
                  <span class="text-lg font-bold tracking-widest group-hover:text-yellow-400 transition-colors">HEADS</span>
                </div>
                <div v-if="selectedSide === 'heads'" class="absolute inset-0 bg-yellow-500/10 border-2 border-yellow-500 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
              </button>

              <button
                  @click="selectedSide = 'tails'"
                  :disabled="isFlipping"
                  class="side-btn group"
                  :class="{ 'active-tails': selectedSide === 'tails' }"
              >
                <div class="relative z-10 flex flex-col items-center gap-2">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-600 shadow-lg flex items-center justify-center font-black text-black text-xl">T</div>
                  <span class="text-lg font-bold tracking-widest group-hover:text-cyan-400 transition-colors">TAILS</span>
                </div>
                <div v-if="selectedSide === 'tails'" class="absolute inset-0 bg-cyan-500/10 border-2 border-cyan-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"></div>
              </button>
            </div>
          </div>

          <div class="relative h-48 w-full flex items-center justify-center bg-black/40 rounded-2xl border border-white/5 shadow-inner overflow-hidden my-2">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,79,246,0.15)_0%,transparent_70%)]"></div>

            <div class="coin-scene">
              <div class="coin" :class="{ 'flipping': isFlipping, 'show-heads': coinResult === 'heads', 'show-tails': coinResult === 'tails' }">
                <!-- Główna powierzchnia monety (HEADS) -->
                <div class="heads">
                  <span class="coin-letter">H</span>
                </div>
                <!-- Tylna powierzchnia (TAILS) -->
                <div class="tails">
                  <span class="coin-letter">T</span>
                </div>
              </div>
            </div>
          </div>

          <div class="h-8 flex items-center justify-center">
            <div v-if="resultMessage"
                 class="text-lg font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2"
                 :class="resultWon ? 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'">
              {{ resultMessage }}
            </div>
          </div>

          <div class="flex flex-col items-center gap-2">
            <button
                @click="flipCoin"
                :disabled="isFlipping || betAmount > (balance || 0)"
                class="cyber-button-start w-full transition-all"
                :class="{ 'grayscale opacity-50 cursor-not-allowed': betAmount > (balance || 0) || isFlipping }"
            >
              <span v-if="isFlipping" class="material-symbols-outlined animate-spin">sync</span>
              <span v-else class="material-symbols-outlined">casino</span>

              {{ isFlipping ? 'FLIPPING...' : (resultMessage ? 'FLIP AGAIN' : 'FLIP COIN') }}
            </button>

            <div v-if="betAmount > (balance || 0)" class="text-red-500 font-bold uppercase tracking-wider text-xs animate-pulse">
              Insufficient Funds!
            </div>
          </div>

        </div>

        <div class="mt-6 border-t border-white/10 pt-6">
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
                <div class="bg-primary/20 p-2 rounded-lg text-primary">
                  <span class="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <h4 class="font-bold text-white mb-1">1. Place Your Bet</h4>
                  <p class="text-sm">Select your wager amount from the dropdown menu.</p>
                </div>
              </div>

              <div class="flex gap-4 items-start">
                <div class="bg-blue-400/20 p-2 rounded-lg text-blue-400">
                  <span class="material-symbols-outlined">touch_app</span>
                </div>
                <div>
                  <h4 class="font-bold text-white mb-1">2. Choose a Side</h4>
                  <p class="text-sm">Pick either <strong>HEADS (Gold)</strong> or <strong>TAILS (Cyan)</strong>. You have a 50% chance to win.</p>
                </div>
              </div>

              <div class="flex gap-4 items-start">
                <div class="bg-green-400/20 p-2 rounded-lg text-green-400">
                  <span class="material-symbols-outlined">emoji_events</span>
                </div>
                <div>
                  <h4 class="font-bold text-white mb-1">3. Double or Nothing</h4>
                  <p class="text-sm">Click FLIP. If the coin lands on your side, you win <strong>2x</strong> your bet!</p>
                </div>
              </div>

            </div>
          </details>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import confetti from "canvas-confetti"

const props = defineProps({
  balance: Number,
  isTestMode: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'balanceChange'])

const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL || ''

// State
const betAmount = ref(10)
const selectedSide = ref<'heads'|'tails'>('heads')
const isFlipping = ref(false)
const resultMessage = ref('')
const resultWon = ref(false)
const coinResult = ref<'heads'|'tails'|null>(null)

const displayBalance = computed(() => (props.balance ?? 0).toFixed(2))

// Funkcja confetti przy wygranej
function fireConfetti() {
  // Złote confetti dla wygranej w coinflip
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B']
  })

  // Dodatkowy burst z góry
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FFD700', '#FFA500', '#FF8C00']
    })
  }, 200)

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFD700', '#FFA500', '#FF8C00']
    })
  }, 400)
}

async function flipCoin() {
  if (isFlipping.value) return

  // Walidacja środków
  if (betAmount.value > (props.balance || 0)) {
    alert("Niewystarczające środki!")
    return
  }

  isFlipping.value = true
  resultMessage.value = ''
  coinResult.value = null

  try {
    let isWin: boolean
    let gain: number
    let finalSide: 'heads' | 'tails'

    if (props.isTestMode) {
      // === TRYB TESTOWY - SYMULACJA ===
      // Losowy wynik (50/50)
      const randomResult = Math.random() < 0.5
      const coinLanded = randomResult ? 'heads' : 'tails'

      isWin = coinLanded === selectedSide.value
      gain = isWin ? betAmount.value : -betAmount.value
      finalSide = coinLanded

    } else {
      // === TRYB PRODUKCYJNY - API ===
      // 1. Mapowanie wyboru na backend (Heads=0, Tails=1)
      const betValue = selectedSide.value === 'heads' ? 0 : 1;

      // 2. Zapytanie do API
      const res = await fetch(`${API}/api/games/play-coin-flip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          betAmount: betAmount.value,
          bet: betValue
        })
      });

      if (!res.ok) throw new Error('Game Error');

      const data = await res.json();
      isWin = data.result === 'WIN';
      gain = data.gain;

      // 3. Ustalanie co wypadło (dedukcja)
      if (isWin) {
        finalSide = selectedSide.value; // Wypadło to co wybrałem
      } else {
        finalSide = selectedSide.value === 'heads' ? 'tails' : 'heads'; // Wypadło przeciwne
      }
    }

    // 4. Animacja - dostosowujemy końcową pozycję do wyniku
    const ANIM_DURATION = 2500;

    // Dynamicznie ustawiamy końcową rotację animacji
    const coinElement = document.querySelector('.coin');
    if (coinElement) {
      if (finalSide === 'heads') {
        coinElement.style.setProperty('--final-rotation', '1440deg'); // 4 obroty = 0° (HEADS)
      } else {
        coinElement.style.setProperty('--final-rotation', '1620deg'); // 4.5 obrotu = 180° (TAILS)
      }
    }

    setTimeout(async () => {
      coinResult.value = finalSide; // To zatrzyma CSS na odpowiedniej stronie

      // Odświeżamy balans (tylko jeśli nie test)
      if (!props.isTestMode && auth.fetchBalance) {
        await auth.fetchBalance();
      } else if (props.isTestMode) {
        // W trybie testowym emitujemy zmianę balansu
        emit('balanceChange', gain);
      }

      if (isWin) {
        resultWon.value = true;
        resultMessage.value = `VICTORY! ${finalSide.toUpperCase()}! (+$${Math.abs(gain)})`;

        // Confetti przy wygranej! 🎉
        setTimeout(() => {
          fireConfetti();
        }, 300); // Małe opóźnienie żeby animacja monety się skończyła
      } else {
        resultWon.value = false;
        resultMessage.value = `DEFEAT! IT WAS ${finalSide.toUpperCase()}.`;
      }

      isFlipping.value = false;
    }, ANIM_DURATION);

  } catch (error) {
    console.error(error);
    isFlipping.value = false;
    resultMessage.value = props.isTestMode ? 'Test mode error' : 'Error connecting to server';
  }
}
</script>

<style scoped>
/* --- CUSTOM SCROLLBAR --- */
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(184, 79, 246, 0.3); border-radius: 10px; }

/* --- NEON TEXT --- */
.neon-text-glow { text-shadow: 0 0 15px rgba(184, 79, 246, 0.7); }

/* --- INPUT STYLES --- */
.setting-group { display: flex; flex-direction: column; gap: 0.5rem; }
.setting-label {
  display: flex; align-items: center; gap: 0.5rem;
  font-weight: 600; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem;
}
.select-wrapper { position: relative; background: rgba(0,0,0,0.4); border-radius: 0.75rem; overflow: hidden; }
.neon-border-blue { border: 1px solid rgba(0, 246, 255, 0.5); box-shadow: 0 0 15px rgba(0, 246, 255, 0.2) inset; }

.setting-select {
  width: 100%; background: transparent; color: #fff; padding: 1rem;
  font-size: 1.1rem; font-weight: bold; font-family: monospace; outline: none; appearance: none; cursor: pointer;
}

/* --- SIDE BUTTONS --- */
.side-btn {
  position: relative;
  height: 100px;
  border-radius: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  transition: all 0.3s;
}
.side-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); }

/* --- DIGITAL READOUT --- */
.digital-readout .label { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); }
.digital-readout .value { font-family: monospace; font-size: 1.2rem; font-weight: 700; text-shadow: 0 0 10px currentColor; }

/* --- MAIN BUTTON --- */
.cyber-button-start {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 2rem;
  font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 0.75rem;
  background: linear-gradient(90deg, #00f6ff, #b84ff6); color: #0a0a0a; font-size: 1.2rem;
  box-shadow: 0 0 25px rgba(184, 79, 246, 0.5); transition: all 0.3s;
}
.cyber-button-start:not(:disabled):hover { transform: scale(1.02) translateY(-2px); box-shadow: 0 0 40px rgba(184, 79, 246, 0.8); }

/* --- COIN 3D ANIMATION --- */
.coin-scene {
  width: 120px;
  height: 120px;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin {
  background: linear-gradient(135deg, #ffd700, #ffed4a, #f59e0b);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  transform-style: preserve-3d;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}

/* Tylna strona cylindra */
.coin::before {
  background: #b8860b; /* Ciemniejszy złoty dla tylnej strony cylindra */
  position: absolute;
  border-radius: 50%;
  content: '';
  height: 120px;
  width: 120px;
  transform: translateZ(-12px); /* Grubość monety */
  box-shadow: 0 0 20px rgba(184, 134, 11, 0.4);
}

/* Bok cylindra monety */
.coin::after {
  background: #b8860b; /* Jednolity ciemniejszy złoty kolor dla boku */
  content: '';
  left: 54px; /* (120px - 12px) / 2 */
  position: absolute;
  height: 120px;
  width: 12px; /* Grubość monety */
  z-index: -1;
  transform: rotateY(-90deg);
  transform-origin: 100% 50%;
}

/* HEADS - przednia strona */
.heads {
  background: linear-gradient(135deg, #ffd700, #ffed4a, #f59e0b);
  position: absolute;
  border-radius: 50%;
  height: 120px;
  width: 120px;
  transform: translateZ(0.1px); /* Bardzo blisko powierzchni głównej */
  border: 3px solid #b8860b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
      0 0 25px rgba(255, 215, 0, 0.8),
      inset 0 0 20px rgba(255,255,255,0.2);
}

/* TAILS - tylna strona */
.tails {
  background: linear-gradient(135deg, #ffd700, #ffed4a, #f59e0b);
  position: absolute;
  border-radius: 50%;
  height: 120px;
  width: 120px;
  transform: translateZ(-12.1px) rotateY(180deg); /* Na tylnej stronie cylindra + obrót */
  border: 3px solid #b8860b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
      0 0 25px rgba(255, 215, 0, 0.8),
      inset 0 0 20px rgba(255,255,255,0.2);
}

/* Litery na monetach */
.coin-letter {
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 0 3px 6px rgba(0,0,0,0.6);
  z-index: 10;
}

.heads .coin-letter {
  color: #5c4002;
}

.tails .coin-letter {
  color: #5c4002;
}

/* Animacja Kręcenia z dynamiczną końcową pozycją */
.coin.flipping {
  animation: spin3D 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Końcowe stany - animacja już kończy się w odpowiedniej pozycji */
.coin.show-heads {
  animation: none;
  transform: rotateY(0deg); /* Pokaż HEADS */
}
.coin.show-tails {
  animation: none;
  transform: rotateY(180deg); /* Pokaż TAILS */
}

@keyframes spin3D {
  0% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  25% {
    transform: rotateY(450deg) rotateX(15deg);
  }
  50% {
    transform: rotateY(900deg) rotateX(0deg);
  }
  75% {
    transform: rotateY(calc(var(--final-rotation, 1440deg) - 270deg)) rotateX(-15deg);
  }
  100% {
    transform: rotateY(var(--final-rotation, 1440deg)) rotateX(0deg);
  }
}
</style>