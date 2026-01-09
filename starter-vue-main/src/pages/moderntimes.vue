<script setup lang="ts">
import { ref, onMounted } from 'vue'
// i-lucide icons must be globally registered in main.ts or use lucide-vue plugin
import FactoryTrucks from '../components/FactoryTrucks.vue'

// Sound effects
//const clickSound = new Audio('/clickon.mp3');
const nextLevelSound = new Audio('/nextlevel.mp3');

// Game level state
const level = ref(1)

const loading = ref(true)
function handleLoaded() {
        loading.value = false
}

// Total progress bar

// Play state for trucks
const playTrucks = ref(false)

const totalProgress = ref(0)
function updateTotalProgress() {
        
}

// Timer clock
// Scratch book (notepad)
const scratchBook = ref('')
function clearScratchBook() {
    scratchBook.value = ''
}
const timer = ref(30)
const timerActive = ref(false)
let timerInterval: number | null = null

function startTimer() {
    timer.value = 30
    timerActive.value = true
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = window.setInterval(() => {
        if (timer.value > 0) {
            timer.value--
        } else {
            timerActive.value = false
            clearInterval(timerInterval!)
            timerInterval = null
            playTrucks.value = false // Stop trucks when time ends
            // End game if timer runs out
            if (gameStarted.value && !gameOver.value && !canNextLevel.value) {
                checkGameOver()
            }
        }
    }, 1000)
}

function stopTimer() {
    timerActive.value = false
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
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
    playTrucks.value = true
    startTimer()
    setTimeout(() => {
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
    totalProgress.value = 0
    gameOver.value = false
    canRetry.value = false
    canNextLevel.value = false
    playTrucks.value = false
    stopTimer()
}

function checkGameOver() {
    updateTotalProgress()
    stopTimer()
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

function revealSecret() {
    alert('Συγχαρητήρια! Αποκάλυψες το μυστικό των Αρχαίων Χρόνων!');
    alert('Είσαι ένας πραγματικός εξερευνητής των μυστηρίων της ιστορίας! Στα αρχαία χρόνια, οι άνθρωποι ζούσαν με απλότητα και σοφία. Οι πρώτοι άνθρωποι παρήγαγαν λίγα απόβλητα, κυρίως οργανική ύλη που αποσυντίθετο. Οι άνθρωποι έθαβαν τα οικιακά απόβλητα σε λάκκους έξω από τα σπίτια τους ή σε κήπους που βρίσκονταν στο πίσω μέρος του σπιτιού. Έτσι τα απόβλητα μετατρέπονταν σε λίπασμα για τα φυτά και τα φυτά τροφή για τα ζώα και τα ζώα τροφή για τους ίδιους. Ένας ωραίος μεγάλος κύκλος της φύσης!');
}

onMounted(() => {
    // Show start button initially
    showTotalProgressBar.value = false
    gameStarted.value = false
    stopTimer()
})
</script>

<template>
    <div class="total-progress-bar-fixed">
                <!-- Scratch Book Notepad -->
                <div class="scratch-book">
                    <div class="scratch-book-header">
                        <span>Scratch Book</span>
                        <button class="scratch-book-clear" @click="clearScratchBook">Clear</button>
                    </div>
                    <textarea
                        v-model="scratchBook"
                        class="scratch-book-textarea"
                        placeholder="Write numbers or notes here..."
                        rows="6"
                    ></textarea>
                </div>
        <div class="timer-clock">
            <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="#3b82f6" stroke-width="4" fill="none" />
                <circle
                    cx="24" cy="24" r="20"
                    stroke="#fbbf24" stroke-width="4" fill="none"
                    :stroke-dasharray="Math.PI * 40"
                    :stroke-dashoffset="Math.PI * 40 * (1 - timer / 30)"
                    stroke-linecap="round"
                    style="transition: stroke-dashoffset 1s linear;"
                />
                <text x="24" y="28" text-anchor="middle" font-size="18" fill="#222">{{ timer }}</text>
            </svg>
        </div>
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
    </div>
    <div class="map-container">
        <FactoryTrucks :play="playTrucks" />
        <div class="rolling-text">
            <span>Καλωσήλθες στους Μοντέρνους Χρόνους!</span>
        </div>
        <div class="rolling-text2">
            <span>Εξερεύνησε τα Μυστήρια των Σύγχρονων Αποβλήτων</span>
        </div>
        <div class="rolling-text3">
            <span>
                Μετά τον 18ο αιώνα, το περιβαλλοντικό αποτύπωμα αυξήθηκε δραματικά λόγω της Βιομηχανικής Επανάστασης, που σήμανε την εξάρτηση από τα ορυκτά καύσιμα, την αύξηση της κατανάλωσης και της παραγωγής αποβλήτων, και την εκμετάλλευση πόρων, οδηγώντας σε κλιματική αλλαγή και περιβαλλοντικές πιέσεις, αν και η τεχνολογική πρόοδος και η κοινωνική ευαισθητοποίηση προσφέρουν λύσεις σήμερα. 
                <br /><br />
                Η WasteCloud έχει στον πυρήνα της την προστασία του περιβάλλοντος και θέλει να μας βοηθήσει να κατανοήσουμε καλύτερα πώς να μειώσουμε, να επαναχρησιμοποιήσουμε και να ανακυκλώσουμε τα απόβλήτά μας.
                <br /><br />
                Κατέγραψε χρησιμοποιώντας τα εργαλεία που προσφέρει η WasteCloud τα απόβλητα που παράγουν τα εργοστάσιά μας έτσι ώστε να υπάρχει σωστός έλεγχος για το τι παράγει, τι πετάει και τι ανακυκλώνει η κάθε επιχείρηση!
            </span>
        </div>
        <img
            v-show="!loading"
            src="/city-night-time.jpg"
            alt="Modern City"
            class="map-image"
            @load="handleLoaded"
        />
    </div>
</template>

<style scoped>
/* Scratch Book Styles */
.scratch-book {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 220px;
    background: #fffbe8;
    border: 2px solid #fbbf24;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    padding: 12px 12px 8px 12px;
    z-index: 350;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.scratch-book-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: #b8860b;
    margin-bottom: 4px;
}
.scratch-book-clear {
    background: none;
    border: none;
    color: #f59e42;
    font-size: 0.95rem;
    cursor: pointer;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: 6px;
    transition: background 0.15s;
}
.scratch-book-clear:hover {
    background: #fbbf24;
    color: #fff;
}
.scratch-book-textarea {
    width: 100%;
    min-height: 90px;
    border: 1.5px solid #fbbf24;
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 1.1rem;
    font-family: 'Fira Mono', 'Consolas', monospace;
    background: #fff;
    resize: vertical;
    color: #222;
    box-sizing: border-box;
}
/* Timer clock styles */
.timer-clock {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}
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
    color: #141659;
    background-color: #499cfbab;
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
</style>