<template>
  <div class="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-4 md:px-8">
    <div class="max-w-4xl mx-auto">

      <div class="mb-8">
        <router-link
            to="/home"
            class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-400 transition-all hover:border-[#b84ff6]/50 hover:bg-white/10 hover:text-white group"
        >
          <span class="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </router-link>
      </div>

      <div class="mb-12 border-b border-white/10 pb-8">
        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
          Terms & <span class="text-[#b84ff6]">Conditions</span>
        </h1>
        <p class="text-gray-400">
          Last updated: <span class="text-white font-bold">December 16, 2025</span>
        </p>
      </div>

      <div class="prose prose-invert prose-purple max-w-none space-y-8 text-gray-300">

        <section>
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-[#b84ff6]">01.</span> Introduction
          </h2>
          <p>
            Welcome to Blac Royale. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-[#b84ff6]">02.</span> Account Registration
          </h2>
          <p>
            To use our services, you must register an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <ul class="list-disc pl-5 space-y-2 mt-4 marker:text-[#b84ff6]">
            <li>You must be at least 18 years old.</li>
            <li>One account per person/household is allowed.</li>
            <li>You are responsible for maintaining the confidentiality of your password.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-[#b84ff6]">03.</span> Deposits and Withdrawals
          </h2>
          <p>
            We offer various methods for depositing funds. All funds must be wagered at least once before they can be withdrawn. We reserve the right to verify your identity before processing any withdrawals (KYC procedure).
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-[#b84ff6]">04.</span> Responsible Gaming
          </h2>
          <p>
            Blac Royale is committed to endorsing responsible gaming as a policy of customer care and social responsibility. We believe it is our responsibility to you, our customers, to ensure that you enjoy your wagering experience on our site, while remaining fully aware of the social and financial harms associated with problem gambling.
          </p>
        </section>

      </div>
    </div>
  </div>
</template>