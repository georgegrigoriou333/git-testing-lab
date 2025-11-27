<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
const props = defineProps<{ direction?: string }>();

const basePoints = [
  { x: 0, y: 80 },
  { x: 50, y: 40 },
  { x: 100, y: 60 },
  { x: 150, y: 20 },
  { x: 200, y: 70 },
  { x: 250, y: 30 },
  { x: 300, y: 80 }
];

const offset = ref(0);
const step = 1;
const t = ref(0);

const animatedPoints = computed(() =>
  basePoints.map((p, i) => ({
    x: p.x + offset.value,
    y: p.y + Math.sin(t.value + i) * 10
  }))
);

const polylinePoints = computed(() =>
  animatedPoints.value.map(p => `${p.x},${p.y}`).join(' ')
);

watch(() => props.direction, (val) => {
  if (val === 'left') offset.value -= step;
  if (val === 'right') offset.value += step;
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
    <svg :width="1280" :height="100" viewBox="0 0 320 100">
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
        r="5"
        fill="#3b82f6"
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
  </div>
</template>

<style scoped>
svg {
  background: linear-gradient(90deg, #000000FF 0%, #e0e7ef 100%);
  border-radius: 12px;
}
</style>
