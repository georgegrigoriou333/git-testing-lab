
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loading = ref(true)
function handleLoaded() {
        loading.value = false
}

const bananaCount = ref(0)
const bananas = ref<{left: number, bottomPx: number}[]>([])
const blueberries = ref<{left: number, bottomPx: number}[]>([])

function showRandomBananas(count: number) {
    bananas.value = []
    for (let i = 0; i < count; i++) {
        bananas.value.push({
            left: Math.random() * 80 + 10,
            bottomPx: Math.random() * 40 + 80 // 80-120px from bottom
        })
    }
    bananaCount.value = count
}

function showRandomBlueberries(count: number) {
    blueberries.value = []
    for (let i = 0; i < count; i++) {
        blueberries.value.push({
            left: Math.random() * 80 + 10,
            bottomPx: Math.random() * 40 + 80 // 80-120px from bottom
        })
    }
}

onMounted(() => {
    setTimeout(() => {
        showRandomBananas(10)
        showRandomBlueberries(10)
    }, 3500) // Wait for rolling text animation to finish
})
</script>

<template>
    <div class="map-container">
        <div class="rolling-text">
            <span>Καλωσήλθες στους Αρχαίους Χρόνους!</span>
        </div>
        <div class="rolling-text2">
            <span>Εξερεύνησε τα Μυστήρια των Αρχαίων Αποβλήτων</span>
        </div>
        <img
            v-show="!loading"
            src="/ancient.png"
            alt="Ancient Map"
            class="map-image"
            @load="handleLoaded"
        />
        <div class="banana-image-row">
            <img src="/banana.png" alt="Banana" class="banana-image" />
        </div>
                <div class="random-bananas">
                    <img
                        v-for="(b, i) in bananas"
                        :key="'banana-' + i"
                        src="/banana.png"
                        alt="Banana"
                        class="banana-image random"
                        :style="`position:absolute; left:${b.left}%; bottom:${b.bottomPx}px; z-index:40;`"
                    />
                    <img
                        v-for="(bb, i) in blueberries"
                        :key="'blueberry-' + i"
                        src="/blueberries.png"
                        alt="Blueberry"
                        class="blueberry-image random"
                        :style="`position:absolute; left:${bb.left}%; bottom:${bb.bottomPx}px; z-index:41;`"
                    />
                </div>
    </div>
</template>

<style scoped>
.map-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin-left: 150px;
    margin-top: 30px;
    position: relative;
}

.rolling-text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: #0f1047;
    animation: rollDown 3.5s cubic-bezier(.4,0,.2,1) forwards;
    z-index: 20;
}

.rolling-text2 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 1rem;
    font-weight: bold;
    color: #292a62;
    animation: rollDown2 3.5s cubic-bezier(.4,0,.2,1) forwards;
    z-index: 20;
}

@keyframes rollDown {
    0% {
        top: -60px;
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    100% {
        top: 120px;
        opacity: 1;
    }
}

@keyframes rollDown2 {
    0% {
        top: -60px;
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    100% {
        top: 165px;
        opacity: 1;
    }
}

.map-image {
    max-width: 90vw;
    max-height: 80vh;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    border-radius: 8px;
}

.banana-image-row {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    opacity: 0;
    animation: fadeInSmallImages 1.2s cubic-bezier(.4,0,.2,1) 3.5s forwards;
    min-height: 120px;
    z-index: 30;
}

.random-bananas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
.banana-image.random {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 16px;
    border: 2px solid #fbbf24;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    background: none;
    display: block;
    margin: 0;
    opacity: 0.95;
    pointer-events: none;
}
.blueberry-image.random {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 16px;
    border: 2px solid #3b82f6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    background: none;
    display: block;
    margin: 0;
    opacity: 0.95;
    pointer-events: none;
}
</style>