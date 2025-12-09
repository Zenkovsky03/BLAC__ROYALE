<template>
  <main class="flex flex-col gap-10 py-10 md:gap-16 md:py-16">
    <section class="flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center gap-4 text-center">
        <h1 class="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl">Top Players Ranking</h1>
        <p class="max-w-xl text-secondary text-base font-normal leading-normal md:text-lg">Climb the ranks and prove your mettle. See where you stand among the elite of Blac Royale.</p>
      </div>
      <div class="flex justify-center">
        <div class="flex items-center gap-2 rounded-lg border border-primary/30 bg-black/30 p-1.5 backdrop-blur-sm">
          <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-primary text-background-dark text-sm font-bold shadow-glow-primary-strong transition-all">
            <span class="truncate">1 Day</span>
          </button>
          <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-white/70 hover:bg-primary/20 hover:text-white transition-all">
            <span class="truncate">Week</span>
          </button>
          <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-white/70 hover:bg-primary/20 hover:text-white transition-all">
            <span class="truncate">Month</span>
          </button>
          <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-white/70 hover:bg-primary/20 hover:text-white transition-all">
            <span class="truncate">Year</span>
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
              <th class="p-4 text-right font-semibold text-secondary">Winnings</th>
              <th class="p-4 text-right font-semibold text-secondary">Win Rate</th>
            </tr>
            </thead>
            <tbody>
            <!-- Example rows, you can replace with dynamic data -->
            <tr class="border-b border-white/10 bg-gradient-to-r from-yellow-500/20 via-transparent to-transparent shadow-glow-gold transition-all duration-300 hover:bg-yellow-500/10">
              <td class="p-4 font-bold text-yellow-400 text-lg">#1</td>
              <td class="p-4 font-medium flex items-center gap-3">
                <img alt="CyberRonin_88 avatar" class="h-8 w-8 rounded-full border-2 border-yellow-400" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJsopNEd-KxGG8JrSt3HuUNrBxFoUenGvEIVIAzZrpbRk8JQuSS3uQc_lPyhzMaHDr7I-QTelajdWajoaE7mFaDl_DTaBNa91Q-6CdfJvrIAsqw_fuAaD0DF5C-B-9EV9EIi1bYziYU3EwHceFI630T1WKwyuvM4AL0MdhlK54OT94marmr9QCqLYDjuevd_dMVyM0ylIMl2Z5Nuef4MVwXkruNMIG3lDhcIWOiBcKCSrqUbn-kryraT_EMW3S-3s2gKQRx01l_8o" />
                <span class="font-bold text-yellow-300">CyberRonin_88</span>
              </td>
              <td class="p-4 text-right font-mono font-bold text-green-400">$1,250,500</td>
              <td class="p-4 text-right font-mono font-medium text-secondary">68.5%</td>
            </tr>
            <tr class="border-b border-white/10 bg-gradient-to-r from-zinc-400/20 via-transparent to-transparent transition-all duration-300 hover:bg-zinc-400/10">
              <td class="p-4 font-bold text-zinc-300 text-lg">#2</td>
              <td class="p-4 font-medium flex items-center gap-3">
                <img alt="GlitchQueen avatar" class="h-8 w-8 rounded-full border-2 border-zinc-400" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi7t359T-9vW2CVS0lccryUlfyEGWYQlxUb2jE5CWaDzewZb2o97xUIsfGQzVTUZPPNvToKz2MuQIqBN_K4dAZZ4EFVatpgIeZNhVlmT3v9oc-ABTouRafO8GlwghgQ1vMhC_3iKmk06bUMhBcOCKd74jB-Xwec5tdLqNfadWa3x0P7sFGQs2Obpl55dISi1mTZSSuDcrv26LBX-EiCEVzpGL16bBV7dVjcH122Xfni-72_RxgvzoDE7787G0h3YQxppfIo9Xq07Q" />
                <span class="font-bold text-zinc-200">GlitchQueen</span>
              </td>
              <td class="p-4 text-right font-mono font-bold text-green-400">$980,230</td>
              <td class="p-4 text-right font-mono font-medium text-secondary">72.1%</td>
            </tr>
            <tr class="border-b border-white/10 bg-gradient-to-r from-orange-400/20 via-transparent to-transparent transition-all duration-300 hover:bg-orange-400/10">
              <td class="p-4 font-bold text-orange-400 text-lg">#3</td>
              <td class="p-4 font-medium flex items-center gap-3">
                <img alt="NeonSpectre avatar" class="h-8 w-8 rounded-full border-2 border-orange-400" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAK47UuUmBFkyLdZij-zvTSdclp05k3EZkn5ZnumBUhgXsAsOotApLBydvYV87g0d2OWnFqnXMD23ThQfEe-8nkRNChQlJhpX9ASC-IU4B_HujVOzB9dAIuWER4sC_7s_kiE0N4tnQaw5EZK-FVVPQKyvlM9dXZDC4bS7rm78WDZ67wMJsC9tlOhHSkq22cSeCJpISNBrbxxc1WOjGK2jKxmn9KXJZgDg_lR7KdlxkRE9dp_eLkCFNVeQxsWw3E7BTmRUnO-QEZkE" />
                <span class="font-bold text-orange-300">NeonSpectre</span>
              </td>
              <td class="p-4 text-right font-mono font-bold text-green-400">$750,110</td>
              <td class="p-4 text-right font-mono font-medium text-secondary">65.8%</td>
            </tr>
            <!-- Add more rows as needed -->
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
// You can add logic for leaderboard filters and dynamic data here
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
