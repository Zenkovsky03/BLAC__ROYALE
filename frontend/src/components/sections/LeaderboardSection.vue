<template>
  <main class="flex flex-col gap-10 py-10 md:gap-16 md:py-16">
    <section class="flex flex-col gap-8 px-4 sm:px-6 lg:px-8">

      <div class="flex flex-col items-center gap-4 text-center">
        <h1 class="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl">
          Top Winners
        </h1>
        <p class="max-w-xl text-secondary text-base font-normal leading-normal md:text-lg">
          Ranking of the best players based on total winnings.
        </p>
      </div>

      <div class="flex justify-center">
        <div class="flex items-center gap-2 rounded-lg border border-primary/30 bg-black/30 p-1.5 backdrop-blur-sm">

          <button
              @click="changePeriod('all')"
              class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-sm font-bold transition-all"
              :class="currentPeriod === 'all' ? 'bg-primary text-background-dark shadow-glow-primary-strong' : 'text-white/70 hover:bg-primary/20 hover:text-white'"
          >
            All Time
          </button>

          <button
              @click="changePeriod('monthly')"
              class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-sm font-bold transition-all"
              :class="currentPeriod === 'monthly' ? 'bg-primary text-background-dark shadow-glow-primary-strong' : 'text-white/70 hover:bg-primary/20 hover:text-white'"
          >
            Month
          </button>

          <button
              @click="changePeriod('weekly')"
              class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-sm font-bold transition-all"
              :class="currentPeriod === 'weekly' ? 'bg-primary text-background-dark shadow-glow-primary-strong' : 'text-white/70 hover:bg-primary/20 hover:text-white'"
          >
            Week
          </button>

        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-secondary/20 bg-background-dark/50 shadow-glow-secondary">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left">
            <thead>
            <tr class="border-b border-secondary/20 bg-secondary/10">
              <th class="p-4 font-semibold text-secondary">Rank</th>
              <th class="p-4 font-semibold text-secondary">Player</th>
              <th class="p-4 text-right font-semibold text-secondary">Total Winnings</th>
              <th class="p-4 text-right font-semibold text-secondary">Wins Count</th>
            </tr>
            </thead>
            <tbody>

            <tr v-if="isLoading">
              <td colspan="4" class="p-8 text-center text-white/50">
                <span class="animate-pulse">Loading ranking data...</span>
              </td>
            </tr>

            <tr v-else-if="rankings.length === 0">
              <td colspan="4" class="p-8 text-center text-white/50">
                No winners found for this period.
              </td>
            </tr>

            <tr
                v-else
                v-for="(player, index) in rankings"
                :key="player.username"
                class="border-b border-white/10 transition-all duration-300 hover:bg-white/5"
                :class="getRowClass(index)"
            >
              <td class="p-4 font-bold text-lg" :class="getRankColor(index)">
                #{{ player.rank }}
              </td>

              <td class="p-4 font-medium flex items-center gap-3">
                <img
                    :alt="player.username"
                    class="h-8 w-8 rounded-full border-2"
                    :class="getBorderColor(index)"
                    :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${player.username}`"
                />
                <span class="font-bold" :class="getTextColor(index)">
                  {{ player.username }}
                </span>
              </td>

              <td class="p-4 text-right font-mono font-bold text-green-400">
                ${{ formatMoney(player.totalWinnings) }}
              </td>

              <td class="p-4 text-right font-mono font-medium text-secondary">
                {{ player.winCount }} wins
              </td>
            </tr>

            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface RankingPlayer {
  rank: number;
  username: string;
  totalWinnings: string;
  winCount: number;
}

const rankings = ref<RankingPlayer[]>([]);
const currentPeriod = ref('all'); // Domyślnie 'all'
const isLoading = ref(false);

// Funkcja pobierająca dane
const fetchRanking = async (period: string) => {
  isLoading.value = true;
  currentPeriod.value = period;

  const base = import.meta.env.VITE_API_URL || '';

  try {
    const res = await fetch(`${base}/api/ranking/${period}`);

    if (res.ok) {
      const data = await res.json();
      rankings.value = data.rankings;
    } else {
      console.error('Błąd pobierania rankingu');
      rankings.value = [];
    }
  } catch (error) {
    console.error("Network error:", error);
  } finally {
    isLoading.value = false;
  }
};

const changePeriod = (period: string) => {
  if (currentPeriod.value !== period) {
    fetchRanking(period);
  }
};

const formatMoney = (value: string | number) => {
  return Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

// --- Helpery do stylów (Złoto, Srebro, Brąz) ---
const getRowClass = (index: number) => {
  if (index === 0) return 'bg-gradient-to-r from-yellow-500/20 via-transparent to-transparent shadow-glow-gold hover:bg-yellow-500/10';
  if (index === 1) return 'bg-gradient-to-r from-zinc-400/20 via-transparent to-transparent hover:bg-zinc-400/10';
  if (index === 2) return 'bg-gradient-to-r from-orange-400/20 via-transparent to-transparent hover:bg-orange-400/10';
  return '';
};

const getRankColor = (index: number) => {
  if (index === 0) return 'text-yellow-400';
  if (index === 1) return 'text-zinc-300';
  if (index === 2) return 'text-orange-400';
  return 'text-white/60';
};

const getBorderColor = (index: number) => {
  if (index === 0) return 'border-yellow-400';
  if (index === 1) return 'border-zinc-400';
  if (index === 2) return 'border-orange-400';
  return 'border-primary/50';
};

const getTextColor = (index: number) => {
  if (index === 0) return 'text-yellow-300';
  if (index === 1) return 'text-zinc-200';
  if (index === 2) return 'text-orange-300';
  return 'text-white';
};

onMounted(() => {
  fetchRanking('all');
});
</script>

<style scoped>
.shadow-glow-primary-strong {
  box-shadow: 0 0 25px 8px rgba(249, 0, 255, 0.7), 0 0 10px 3px rgba(249, 0, 255, 0.7) inset;
}
.shadow-glow-secondary {
  box-shadow: 0 0 15px 5px rgba(0, 246, 255, 0.4);
}
.shadow-glow-gold {
  box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.5);
}
</style>