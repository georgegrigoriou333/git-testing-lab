<script setup lang="ts">
// No props needed for static background
</script>

<template>
  <svg class="absolute inset-0 w-full h-full z-0" viewBox="0 0 320 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="1280" height="100" fill="url(#bgGradient)" />
    <defs>
      <linearGradient id="bgGradient" x1="0" y1="0" x2="320" y2="100" gradientUnits="userSpaceOnUse">
        <stop stop-color="#e0e7ef" />
        <stop offset="1" stop-color="#f0f4f8" />
      </linearGradient>
    </defs>
    <!-- Example: faded grid lines for a map effect -->
    <g stroke="#b0b8c1" stroke-width="0.5" opacity="0.3">
      <line v-for="i in 16" :key="'v'+i" :x1="i*20" y1="0" :x2="i*20" y2="100" />
      <line v-for="i in 10" :key="'h'+i" x1="0" :y1="i*10" x2="320" :y2="i*10" />
    </g>
    <!-- Example: faded circles for history nodes -->
    <circle v-for="i in 7" :key="'node'+i" :cx="i*45" :cy="50 + Math.sin(i)*30" r="12" fill="#b0b8c1" opacity="0.08" />
  </svg>
</template>

<style scoped>
svg {
  pointer-events: none;
}
</style>
