<template>
  <div class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050505] font-display text-white">

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="relative z-10 flex flex-col items-center gap-8 text-center px-4">

      <h1 class="text-[10rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 drop-shadow-[0_0_25px_rgba(184,79,246,0.8)] select-none md:text-[14rem]">
        404
      </h1>

      <div class="space-y-4">
        <h2 class="text-3xl md:text-4xl font-bold uppercase tracking-widest text-primary animate-pulse">
          System Error
        </h2>
        <p class="max-w-md text-lg text-secondary/80 leading-relaxed">
          Looks like you've bet on the wrong page. <br>
          This area is off-limits or doesn't exist.
        </p>
      </div>

      <router-link
          to="/home"
          class="group relative mt-4 flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/50 px-8 py-4 font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-primary hover:border-primary hover:scale-105 hover:shadow-[0_0_30px_rgba(184,79,246,0.6)]"
      >
        <span class="material-symbols-outlined transition-transform group-hover:-translate-x-1">west</span>
        Return to Lobby
      </router-link>

    </div>

    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

  </div>
</template>

<style scoped>
@keyframes flicker {
  0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
    opacity: 0.99;
    text-shadow: 0 0 25px rgba(184, 79, 246, 0.8);
  }
  20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
    opacity: 0.4;
    text-shadow: none;
  }
}

h1 {
  animation: flicker 4s infinite;
}
</style>