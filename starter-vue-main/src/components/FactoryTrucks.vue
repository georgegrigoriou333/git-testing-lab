<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{ play: boolean }>()

const trucks = ref<Array<{ id: string; x: number; number: number }>>([])
let truckInterval: number | null = null

function launchTruck() {
  const id = Math.random().toString(36).slice(2)
  const number = Math.floor(Math.random() * 100)
  trucks.value.push({ id, x: 100, number })
  animateTruck(id)
}

function animateTruck(id: string) {
  const interval = setInterval(() => {
    const truck = trucks.value.find(t => t.id === id)
    if (truck) {
      truck.x -= 2
      if (truck.x >= 100) {
        clearInterval(interval)
        trucks.value = trucks.value.filter(t => t.id !== id)
      }
    }
  }, 50)
}

watch(
  () => props.play,
  (val) => {
    if (val) {
      truckInterval = setInterval(launchTruck, 1200)
    } else {
      if (truckInterval) clearInterval(truckInterval)
      truckInterval = null
      trucks.value = []
    }
  }
)

onMounted(() => {
  if (props.play) truckInterval = setInterval(launchTruck, 1200)
})
</script>

<template>
  <div class="factory-trucks">
    <UIcon name="i-lucide-factory" class="factory-icon" />
    <transition-group name="truck-move" tag="div" class="trucks-row">
      <div
        v-for="truck in trucks"
        :key="truck.id"
        class="truck"
        :style="{ left: truck.x + '%' }"
      >
        <UIcon name="i-lucide-truck" class="truck-icon" />
        <span class="truck-number">{{ truck.number }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.factory-trucks {
  position: absolute;
  right: 40px;
  bottom: 120px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.factory-icon {
  font-size: 248px;
  color: #444;
  margin-bottom: -115px;
}
.trucks-row {
  position: relative;
  width: 400px;
  height: 60px;
}
.truck {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  transition: left 0.05s linear;
}
.truck-icon {
  font-size: 136px;
  color: #3b82f6;
}
.truck-number {
  margin-left: -110px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #222;
  background: #fffbe8;
  border: 1.5px solid #fbbf24;
  border-radius: 6px;
  padding: 2px 8px;
}
.truck-move-enter-active, .truck-move-leave-active {
  transition: opacity 0.5s;
}
.truck-move-enter-from, .truck-move-leave-to {
  opacity: 0;
}
</style>
