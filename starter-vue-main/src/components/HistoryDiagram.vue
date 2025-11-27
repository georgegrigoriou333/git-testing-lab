<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
const props = defineProps<{ direction?: string }>();

const basePoints = [
  { x: 0, y: 10 },
  { x: 10, y: 0 },
  { x: 20, y: 10 },
  { x: 30, y: 0 },
  { x: 40, y: 10 },
  { x: 50, y: 0 },
  { x: 60, y: 10 }
];

const offsetX = ref(-50);
const offsetY = ref(50);
const step = 1;
const t = ref(0);

const animatedPoints = computed(() =>
  basePoints.map((p, i) => ({
    x: p.x + offsetX.value,
    y: p.y + Math.sin(t.value + i) * 10 + offsetY.value,
    isSpecial: p.x + offsetX.value === 20
  }))
);

const showPopup = ref(false);
watch(animatedPoints, (points) => {
  if (points.some(p => p.isSpecial)) {
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 2000);
  }
});

const polylinePoints = computed(() =>
  animatedPoints.value.map(p => `${p.x},${p.y}`).join(' ')
);

watch(() => props.direction, dir => {
  if (dir === 'left') offsetX.value -= step;
  if (dir === 'right') offsetX.value += step;
  if (dir === 'up') offsetY.value -= step;
  if (dir === 'down') offsetY.value += step;
});

onMounted(() => {
  function animate() {
    t.value += 0.03;
    requestAnimationFrame(animate);
  }
  animate();
});
</script>

<template>
  <div class="flex flex-col items-center py-6 gap-2">
    <svg :width="1280" :height="100" viewBox="0 0 1280 100">
      <polyline
        :points="polylinePoints"
        fill="none"
        stroke="#3b82f6"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        v-for="(p, i) in animatedPoints"
        :key="i"
        :cx="p.x"
        :cy="p.y"
        :r="p.isSpecial ? 16 : 5"
        :fill="p.isSpecial ? '#ef4444' : '#3b82f6'"
      />
      <!-- Draw arrows between points -->
      <g v-for="(p, i) in animatedPoints" :key="'arrow-' + i">
        <template v-if="i < animatedPoints.length - 1">
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#3b82f6" />
            </marker>
          </defs>
          <line
            :x1="p.x"
            :y1="p.y"
            :x2="animatedPoints[i+1].x"
            :y2="animatedPoints[i+1].y"
            stroke="#3b82f6"
            stroke-width="2"
            marker-end="url(#arrowhead)"
          />
        </template>
      </g>
    </svg>
    <div v-if="showPopup" class="flex justify-center items-center transform -translate-x-1/2 -translate-y-1/2 text-gray-50 px-8 py-6 rounded-xl shadow-lg z-50 text-sm font-bold">
      {{ $t('message.reachedPoint20') }}
    </div>
  </div>
</template>

<style scoped>
svg {
  border-radius: 12px;
}
</style>
