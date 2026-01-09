<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Sound effects
const clickSound = new Audio('/clickon.mp3');
const nextLevelSound = new Audio('/nextlevel.mp3');
// Game level state
const level = ref(1)

const router = useRouter();

const loading = ref(true)
function handleLoaded() {
        loading.value = false
}

const bananaCount = ref(0)

const showSheep = ref(false)
const sheepDropped = ref(false)
const sheepFallDuration = ref(1.6)
const sheepBounce = ref(false)
const sheepWalk = ref(false)
const sheepSound = new Audio('/sheep.mp3')

type Fruit = {
    left: number,
    bottomPx: number,
    id: string,
    type: 'banana' | 'blueberry',
    collected?: boolean,
    falling?: boolean,
    fallDuration?: number,
    splash?: boolean
}

const bananas = ref<Array<Fruit & { falling?: boolean }>>([])
const blueberries = ref<Array<Fruit & { falling?: boolean }>>([])

// Total progress bar
const totalProgress = ref(0)
function updateTotalProgress() {
    const total = bananas.value.length + blueberries.value.length;
    const collected = bananas.value.filter(b => b.collected).length + blueberries.value.filter(b => b.collected).length;
    totalProgress.value = total > 0 ? Math.round((collected / total) * 100) : 0;
}

function showRandomBananas(count: number) {
    bananas.value = []
    for (let i = 0; i < count; i++) {
        bananas.value.push({
            left: Math.random() * 80 + 10,
            bottomPx: 600,
            id: 'banana-' + i + '-' + Math.random().toString(36).slice(2),
            type: 'banana',
            falling: true,
            fallDuration: level.value === 2 ? Math.random() * 8 + 14 : 20 // random for level 2, fixed for level 1
        })
    }
    bananaCount.value = count
    // Animate drop (slow)
    setTimeout(() => {
        bananas.value = bananas.value.map(b => ({ ...b, bottomPx: Math.random() * 40 + 80 }))
        setTimeout(() => {
            bananas.value = bananas.value.map(b => ({ ...b, falling: false }))
        }, 20000)
    }, 1000)
}

function showRandomBlueberries(count: number) {
    blueberries.value = []
    for (let i = 0; i < count; i++) {
        blueberries.value.push({
            left: Math.random() * 80 + 10,
            bottomPx: 600,
            id: 'blueberry-' + i + '-' + Math.random().toString(36).slice(2),
            type: 'blueberry',
            falling: true,
            fallDuration: level.value === 2 ? Math.random() * 8 + 14 : 20
        })
    }
    setTimeout(() => {
        blueberries.value = blueberries.value.map(bb => ({ ...bb, bottomPx: Math.random() * 40 + 80 }))
        setTimeout(() => {
            blueberries.value = blueberries.value.map(bb => ({ ...bb, falling: false }))
        }, 20000)
    }, 1000)
}

function handleFruitClick(fruit: Fruit & { falling?: boolean }) {
    if (fruit.collected || !fruit.falling) return;
    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play();
    // Splash effect
    if (fruit.type === 'banana') {
        const idx = bananas.value.findIndex(b => b.id === fruit.id);
        if (idx !== -1) {
            bananas.value[idx].splash = true;
            setTimeout(() => {
                bananas.value[idx].splash = false;
                bananas.value[idx].collected = true;
                updateTotalProgress();
            }, 350);
        }
    } else {
        const idx = blueberries.value.findIndex(b => b.id === fruit.id);
        if (idx !== -1) {
            blueberries.value[idx].splash = true;
            setTimeout(() => {
                blueberries.value[idx].splash = false;
                blueberries.value[idx].collected = true;
                updateTotalProgress();
            }, 350);
        }
    }
}

const showTotalProgressBar = ref(false)
const gameStarted = ref(false)
const gameOver = ref(false)
const canRetry = ref(false)
const canNextLevel = ref(false)

function startGame() {
    resetGame()
    gameStarted.value = true
    showTotalProgressBar.value = true
    setTimeout(() => {
        showRandomBananas(10)
        showRandomBlueberries(10)
        setTimeout(() => {
            updateTotalProgress()
        }, 500)
        // Set up game over check after fruits stop falling
        setTimeout(() => {
            checkGameOver()
        }, 21000)
    }, 500)
}

function resetGame() {
    bananas.value = []
    blueberries.value = []
    totalProgress.value = 0
    gameOver.value = false
    canRetry.value = false
    canNextLevel.value = false
}

function checkGameOver() {
    updateTotalProgress()
    if (totalProgress.value === 100) {
        canNextLevel.value = true
        gameOver.value = false
        canRetry.value = false
    } else {
        gameOver.value = true
        canRetry.value = true
        canNextLevel.value = false
    }
}

function nextLevel() {
    // Play next level sound
    nextLevelSound.currentTime = 0;
    nextLevelSound.play();
    // Go to level 2: random speed for fruits
    level.value = 2
    startGame()
}


const showSecretMsg = ref(false)
const secretMsgTitle = ref('')
const secretMsgBody = ref('')

function revealSecret() {
    setTimeout(() => {
        secretMsgTitle.value = 'Συγχαρητήρια! Αποκάλυψες το μυστικό των Αρχαίων Χρόνων!';
        secretMsgBody.value = 'Είσαι ένας πραγματικός εξερευνητής των μυστηρίων της ιστορίας! Στα αρχαία χρόνια, οι άνθρωποι ζούσαν με απλότητα και σοφία. Οι πρώτοι άνθρωποι παρήγαγαν λίγα απόβλητα, κυρίως οργανική ύλη που αποσυντίθετο. Οι άνθρωποι έθαβαν τα οικιακά απόβλητα σε λάκκους έξω από τα σπίτια τους ή σε κήπους που βρίσκονταν στο πίσω μέρος του σπιτιού. Έτσι τα απόβλητα μετατρέπονταν σε λίπασμα για τα φυτά και τα φυτά τροφή για τα ζώα και τα ζώα τροφή για τους ίδιους. Ένας ωραίος μεγάλος κύκλος της φύσης!';
        showSecretMsg.value = true;

        // 🐑 Random fall speed (1.2s – 2.8s)
        sheepFallDuration.value = Math.random() * 1.6 + 1.2;

        showSheep.value = true;
        sheepDropped.value = false;
        sheepBounce.value = false;
        sheepWalk.value = false;

        // slight delay before drop
        setTimeout(() => {
            sheepDropped.value = true;
            sheepSound.currentTime = 0;
            sheepSound.play();
        }, 100);

        // bounce effect after landing
        setTimeout(() => {
            sheepBounce.value = true;
        }, sheepFallDuration.value * 1000);

        // walk effect after bounce
        setTimeout(() => {
            sheepWalk.value = true;
        }, sheepFallDuration.value * 1000 + 1000);

        // navigate after full animation
        setTimeout(() => {
            router.push('/middletimes');
        }, sheepFallDuration.value * 1000 + 5000 + 2500);

    }, 100);
}

onMounted(() => {
    // Show start button initially
    showTotalProgressBar.value = false
    gameStarted.value = false
})
</script>

<template>
    <div class="total-progress-bar-fixed">
        <div class="total-progress-label">Συνολική Πρόοδος</div>
        <div class="progress-bar total">
            <div class="progress-bar-inner total" :style="`width: ${totalProgress}%;`"></div>
        </div>
        <div class="total-progress-value">{{ totalProgress }}%</div>
        <div v-if="!gameStarted" class="game-btns-bar">
            <button class="game-btn" @click="startGame">Ξεκίνα το παιχνίδι</button>
        </div>
        <div class="game-btns-bar">
            <button v-if="gameOver && canRetry" class="game-btn" @click="startGame">Ξαναπροσπάθησε</button>
            <button v-if="canNextLevel && level === 1" class="game-btn" @click="nextLevel">Επόμενο επίπεδο</button>
            <button v-if="canNextLevel && level === 2" class="game-btn" @click="revealSecret">Αποκάλυψε το μυστικό</button>
        </div>
        <UButton>
            <router-link to="/middletimes">Skip to MiddleTimes</router-link>
        </UButton>
    </div>
    <div class="map-container">
        <div v-if="showSecretMsg" class="secret-msg-overlay">
            <div class="secret-msg-box">
                <h2>{{ secretMsgTitle }}</h2>
                <p>{{ secretMsgBody }}</p>
                <button class="game-btn" @click="showSecretMsg = false">OK</button>
            </div>
        </div>
        <div class="rolling-text">
            <span>Καλωσήλθες στους Αρχαίους Χρόνους!</span>
        </div>
        <div class="rolling-text2">
            <span>Εξερεύνησε τα Μυστήρια των Αρχαίων Αποβλήτων</span>
        </div>
        <div class="rolling-text3">
            <span>
                Οι πρώτοι άνθρωποι εμφανίστηκαν πριν από περίπου 2,5 εκατομμύρια χρόνια. 
                Κατά την αρχαιότητα, οι άνθρωποι ζούσαν κυρίως ως κυνηγοί-τροφοσυλλέκτες,
                χρησιμοποιώντας απλά εργαλεία από πέτρα και ξύλο.
                <br /><br />
                Μάζεψε όλα τα φρούτα πριν πέσουν στο έδαφος για να μάθεις περισσότερα!
            </span>
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
                v-for="b in bananas"
                :key="b.id"
                v-show="!b.collected"
                src="/banana.png"
                alt="Banana"
                class="banana-image random drop-fruit clickable-fruit"
                :class="{ 'fruit-splash': b.splash }"
                :style="`position:absolute; left:${b.left}%; bottom:${b.bottomPx}px; z-index:40; transition: bottom ${b.fallDuration ?? 30}s cubic-bezier(.4,0,.2,1); ${b.falling ? 'pointer-events:auto;cursor:pointer;' : 'pointer-events:none;cursor:default;'} `"
                @click="b.falling ? handleFruitClick(b) : null"
            />
            <img
                v-for="bb in blueberries"
                :key="bb.id"
                v-show="!bb.collected"
                src="/blueberries.png"
                alt="Blueberry"
                class="blueberry-image random drop-fruit clickable-fruit"
                :class="{ 'fruit-splash': bb.splash }"
                :style="`position:absolute; left:${bb.left}%; bottom:${bb.bottomPx}px; z-index:41; transition: bottom ${bb.fallDuration ?? 30}s cubic-bezier(.4,0,.2,1); ${bb.falling ? 'pointer-events:auto;cursor:pointer;' : 'pointer-events:none;cursor:default;'} `"
                @click="bb.falling ? handleFruitClick(bb) : null"
            />

            <img
                v-if="showSheep"
                src="/sheep.gif"
                alt="Sheep"
                class="sheep-drop"
                :class="{
                    dropped: sheepDropped,
                    bounce: sheepBounce,
                    walk: sheepWalk
                }"
                :style="`transition-duration: ${sheepFallDuration}s;`"
            />
        </div>
    </div>
</template>

<style scoped>
@keyframes fruitSplash {
    0% {
        transform: scale(1) rotate(0deg);
        filter: brightness(1) drop-shadow(0 0 0 #fff);
        opacity: 1;
    }
    60% {
        transform: scale(1.35) rotate(-10deg);
        filter: brightness(1.5) drop-shadow(0 0 12px #fff7b2);
        opacity: 0.85;
    }
    100% {
        transform: scale(0.7) rotate(10deg);
        filter: brightness(0.7) drop-shadow(0 0 0 #fff);
        opacity: 0;
    }
}
.fruit-splash {
    animation: fruitSplash 0.35s cubic-bezier(.4,0,.2,1);
    z-index: 200 !important;
}
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

.rolling-text3 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    width: 90%;
    display: flex;
    justify-content: center;
    font-size: 1rem;
    font-weight: bold;
    color: #292a62;
    animation: rollDown3 3.5s cubic-bezier(.4,0,.2,1) forwards;
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

@keyframes rollDown3 {
    0% {
        top: -60px;
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    100% {
        top: 225px;
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
.banana-image.random, .blueberry-image.random {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    background: none;
    display: block;
    margin: 0;
    opacity: 0.95;
}
.banana-image.random {
    border: 2px solid #fbbf24;
}
.blueberry-image.random {
    border: 2px solid #3b82f6;
}
.clickable-fruit {
    pointer-events: auto;
    cursor: pointer;
    transition: box-shadow 0.2s;
}
.clickable-fruit:hover {
    box-shadow: 0 4px 16px #fbbf24, 0 2px 8px rgba(0,0,0,0.08);
    z-index: 100;
}
.progress-bar-container {
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
    width: 220px;
    background: rgba(255,255,255,0.95);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    padding: 18px 18px 12px 18px;
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.progress-bar-label {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: #222;
    font-weight: 500;
}

.total-progress-bar-fixed {
    position: fixed;
    top: 74px;
    right: 32px;
    z-index: 300;
    background: rgba(51, 154, 245, 0.98);
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    padding: 16px 24px 12px 24px;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}
.total-progress-label {
    font-size: 1.1rem;
    color: #222;
    font-weight: 600;
    margin-bottom: 2px;
}
.total-progress-value {
    font-size: 1.1rem;
    color: #0f1047;
    font-weight: 600;
    margin-top: 2px;
}
.progress-bar {
    width: 100%;
    height: 18px;
    background: #e0e7ef;
    border-radius: 9px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.progress-bar-inner {
    height: 100%;
    background: linear-gradient(90deg, #fbbf24 0%, #f59e42 100%);
    border-radius: 9px 0 0 9px;
    transition: width 0.15s;
}
.progress-bar.total {
    height: 14px;
    margin-top: 2px;
    margin-bottom: 2px;
}
.progress-bar-inner.total {
    background: linear-gradient(90deg, #3b82f6 0%, #fbbf24 100%);
    border-radius: 9px;
    transition: width 0.2s;
}

.game-btns-bar {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    margin-top: 18px;
}
.game-btn {
    font-size: 1.2rem;
    padding: 5px 5px 5px 5px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(90deg, #fbbf24 0%, #f59e42 100%);
    color: #222;
    font-weight: bold;
    margin-top: 18px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: background 0.2s;
}
.game-btn:hover {
    background: linear-gradient(90deg, #f59e42 0%, #fbbf24 100%);
}
.game-over-msg {
    font-size: 1.3rem;
    color: #0f1047;
    font-weight: bold;
    margin-bottom: 12px;
}

.secret-msg-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.45);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}
.secret-msg-box {
    background: #fffbe8;
    border-radius: 18px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    padding: 36px 32px 28px 32px;
    max-width: 420px;
    text-align: center;
    border: 2px solid #fbbf24;
}
.secret-msg-box h2 {
    font-size: 1.5rem;
    color: #0f1047;
    margin-bottom: 18px;
}
.secret-msg-box p {
    font-size: 1.1rem;
    color: #222;
    margin-bottom: 22px;
}

.sheep-drop {
    position: absolute;
    top: -180px;
    left: 50%;
    transform: translateX(-50%) scale(0.7);
    width: 130px;
    z-index: 500;
    pointer-events: none;
    transition:
        top cubic-bezier(.22,.61,.36,1),
        transform 0.4s ease;
}

.sheep-drop.dropped {
    top: 70%;
    transform: translateX(-50%) scale(1);
}

.sheep-drop.bounce {
    animation: sheepBounce 0.9s ease-out;
}

.sheep-drop.walk {
    animation: sheepWalkLeft 8.5s linear forwards;
}

@keyframes sheepWalkLeft {
    0% {
        left: 50%;
    }
    100% {
        left: -100%;
    }
}

@keyframes sheepBounce {
    0%   { transform: translateX(-50%) scale(1); }
    30%  { transform: translateX(-50%) scale(1.1) translateY(-12px); }
    55%  { transform: translateX(-50%) scale(0.95); }
    75%  { transform: translateX(-50%) scale(1.03); }
    100% { transform: translateX(-50%) scale(1); }
}
</style>