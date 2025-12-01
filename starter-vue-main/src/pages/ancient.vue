<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
function handleLoaded() {
    loading.value = false
}
</script>

<template>
    <div class="map-container">            
        <img
            v-show="!loading"
            src="/ancient.png"
            alt="Ancient Map"
            class="map-image"
            @load="handleLoaded"
        />
    </div>
</template>

<style scoped>

.map-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin-left: 150px;
    margin-top: 30px;
}

.map-image {
    max-width: 90vw;
    max-height: 80vh;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    border-radius: 8px;
}
</style>