<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ direction?: 'left' | 'right' | 'up' | 'down' }>()
const router = useRouter()

// Base points for polyline
const basePoints = [
  { x: 0, y: 10 },
  { x: 10, y: 0 },
  { x: 20, y: 10 },
  { x: 30, y: 0 },
  { x: 40, y: 10 },
  { x: 50, y: 0 },
  { x: 60, y: 10 }
]

// Animation state
const offsetX = ref(-50)
const offsetY = ref(50)
const t = ref(0)
const step = 1

// Computed animated points
const animatedPoints = computed(() =>
  basePoints.map((p, i) => ({
    x: p.x + offsetX.value,
    y: p.y + Math.sin(t.value + i) * 10 + offsetY.value,
    isSpecial: p.x + offsetX.value === 100
  }))
)

// Polyline points string for SVG
const polylinePoints = computed(() =>
  animatedPoints.value.map(p => `${p.x},${p.y}`).join(' ')
)

// Tooltip and auto-navigation logic
const showPopup = ref(false)
const hasNavigated = ref(false)
watchEffect(() => {
  if (animatedPoints.value.some(p => p.isSpecial)) {
    showPopup.value = true
    setTimeout(() => (showPopup.value = false), 2000)
    if (!hasNavigated.value) {
      hasNavigated.value = true
      router.push('/ancient')
    }
  } else {
    hasNavigated.value = false
  }
})

// Handle clicking on special dot
function handleDotClick() {
  router.push('/ancient')
}

// Move points based on direction prop
watchEffect(() => {
  if (!props.direction) return
  switch (props.direction) {
    case 'left':
      offsetX.value -= step
      break
    case 'right':
      offsetX.value += step
      break
    case 'up':
      offsetY.value -= step
      break
    case 'down':
      offsetY.value += step
      break
  }
})

// Animation loop
onMounted(() => {
  const animate = () => {
    t.value += 0.03
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<template>
  <div class="flex flex-col items-center py-6 gap-2">
    <svg :width="1280" :height="100" viewBox="0 0 1280 100">
      <!-- Animated polyline -->
      <polyline
        :points="polylinePoints"
        fill="none"
        stroke="#3b82f6"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <!-- Animated points -->
      <circle
        v-for="(p, i) in animatedPoints"
        :key="i"
        :cx="p.x"
        :cy="p.y"
        :r="p.isSpecial ? 16 : 5"
        :fill="p.isSpecial ? '#ef4444' : '#3b82f6'"
      />
      
      <!-- Static red dot at x=100 -->
      <circle
        cx="100"
        :cy="(basePoints.find(p => p.x === 100)?.y ?? 10) + offsetY"
        r="16"
        fill="#ef4444"
        style="cursor:pointer"
        @click="handleDotClick"
      />

      <!-- Arrows between points -->
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#3b82f6" />
        </marker>
      </defs>
      <template v-for="(p, i) in animatedPoints">
        <line
          v-if="i < animatedPoints.length - 1"
          :key="'arrow-' + i"
          :x1="p.x"
          :y1="p.y"
          :x2="animatedPoints[i+1].x"
          :y2="animatedPoints[i+1].y"
          stroke="#3b82f6"
          stroke-width="2"
          marker-end="url(#arrowhead)"
        />
      </template>
    </svg>
  </div>
</template>
