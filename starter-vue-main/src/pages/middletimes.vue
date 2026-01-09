<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(true)
function handleLoaded() {
        loading.value = false
}

/* ------------------ Sounds ------------------ */
const captureSound = new Audio('/clickon.mp3')
const nextLevelSound = new Audio('/nextlevel.mp3')

/* ------------------ Game State ------------------ */

const level = ref(1)
const gameStarted = ref(false)
const gameOver = ref(false)
const canRetry = ref(false)
const canNextLevel = ref(false)

const showSecretMsg = ref(false)
const secretMsgTitle = ref('')
const secretMsgBody = ref('')

const totalProgress = ref(0)

// Timer clock
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
      // End game if timer runs out
      if (gameStarted.value && !gameOver.value && !canNextLevel.value) {
        endGame()
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

/* ------------------ Cat ------------------ */
const cat = ref({ x: 45, y: 30 }) // %
const CAT_SPEED = 3

function moveCat(dir: 'left' | 'right' | 'up' | 'down') {
  if (dir === 'left') cat.value.x = Math.max(0, cat.value.x - CAT_SPEED)
  if (dir === 'right') cat.value.x = Math.min(90, cat.value.x + CAT_SPEED)
  //if (dir === 'up') cat.value.y = Math.min(90, cat.value.y + CAT_SPEED)
  //if (dir === 'down') cat.value.y = Math.max(0, cat.value.y - CAT_SPEED)
}

/* ------------------ Rodents ------------------ */
type Rodent = {
  id: string
  type: 'mouse' | 'rat'
  x: number
  y: number
  dx: number
  dy: number
  speed: number
  collected?: boolean
}

const rodents = ref<Rodent[]>([])

/* ------------------ Spawn ------------------ */
function spawnRodents(count: number) {
  rodents.value = []
  for (let i = 0; i < count; i++) {
    rodents.value.push({
      id: 'mouse-' + Math.random(),
      type: 'mouse',
      x: Math.random() * 90,
      y: Math.random() * 70,
      dx: Math.random() < 0.5 ? 1 : -1,
      dy: Math.random() < 0.5 ? 1 : -1,
      speed: Math.random() * 0.4 + 0.3
    })
    rodents.value.push({
      id: 'rat-' + Math.random(),
      type: 'rat',
      x: Math.random() * 90,
      y: Math.random() * 70,
      dx: Math.random() < 0.5 ? 1 : -1,
      dy: Math.random() < 0.5 ? 1 : -1,
      speed: Math.random() * 0.6 + 0.5
    })
  }
  runGameLoop()
}

/* ------------------ Game Loop ------------------ */
let loop: number | null = null

function runGameLoop() {
  loop = window.setInterval(() => {
    rodents.value.forEach(r => {
      if (!r.collected) {
        // Move rodent in random direction
        r.x += r.dx * r.speed * (level.value === 2 ? 1.3 : 1)
        r.y += r.dy * r.speed * (level.value === 2 ? 1.3 : 1)

        // Bounce off edges
        if (r.x < 0 || r.x > 90) r.dx *= -1
        if (r.y < 0 || r.y > 70) r.dy *= -1
        r.x = Math.max(0, Math.min(90, r.x))
        r.y = Math.max(0, Math.min(70, r.y))
      }
    })

    checkCollisions()
    updateProgress()

    if (rodents.value.every(r => r.collected)) {
      endGame()
    }
  }, 50)
}

function stopLoop() {
  if (loop) clearInterval(loop)
}

/* ------------------ Collision ------------------ */
function checkCollisions() {
  rodents.value.forEach(r => {
    if (!r.collected && Math.hypot(r.x - cat.value.x, r.y - cat.value.y) < 5) {
      r.collected = true
      captureSound.currentTime = 0
      captureSound.play()
    }
  })
}

/* ------------------ Progress ------------------ */
function updateProgress() {
  const total = rodents.value.length
  const collected = rodents.value.filter(r => r.collected).length
  totalProgress.value = total ? Math.round((collected / total) * 100) : 0
}

/* ------------------ Flow ------------------ */
function startGame() {
  resetGame()
  gameStarted.value = true
  spawnRodents(8)
  startTimer()
}

function resetGame() {
  stopLoop()
  stopTimer()
  rodents.value = []
  totalProgress.value = 0
  gameOver.value = false
  canRetry.value = false
  canNextLevel.value = false
}

function endGame() {
  stopLoop()
  stopTimer()
  if (totalProgress.value === 100) {
    canNextLevel.value = true
  } else {
    gameOver.value = true
    canRetry.value = true
  }
}

function nextLevel() {
  nextLevelSound.play()
  level.value = 2
  startGame()
}

function revealSecret() {
  alert('Οι γάτες κράτησαν τα τρωκτικά μακριά! 🌿')
  router.push('/moderntimes')
}

/* ------------------ Controls ------------------ */
function handleKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') moveCat('left')
  if (e.key === 'ArrowRight') moveCat('right')
  if (e.key === 'ArrowUp') moveCat('up')
  if (e.key === 'ArrowDown') moveCat('down')
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  stopTimer()
})
</script>

<template>
    <div class="total-progress-bar-fixed">
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
      <UButton>
        <router-link to="/moderntimes">Skip to ModernTimes</router-link>
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
            <span>Καλωσήλθες στους Ύστερους Χρόνους!</span>
        </div>
        <div class="rolling-text2">
            <span>Εξερεύνησε τα Μυστήρια των Ύστερων Αποβλήτων</span>
        </div>
        <div class="rolling-text3">
            <span>
                Οι άνθρωποι αυξήθηκαν κατά πολύ. Τα απόβλητα γέμισαν τους δρόμους και τα τρωκτικά πολλαπλασιάστηκαν. Τα ποντίκια και οι αρουραίοι απειλούσαν την υγεία των κατοίκων.
                <br /><br />
                Κυνήγησε τα τρωκτικά με τη βοήθεια της γάτας σου και διατήρησε την πόλη καθαρή!
            </span>
        </div>
        <img
            v-show="!loading"
            src="/city.jpg"
            alt="City Map"
            class="map-image"
            @load="handleLoaded"
        />
        <!-- Cat -->
        <img
            src="/cat.png"
            class="cat"
            :style="`left:${cat.x}%; bottom:${cat.y}%;`"
        />

        <!-- Rodents -->
        <img
            v-for="r in rodents"
            :key="r.id"
            v-show="!r.collected"
            :src="r.type === 'mouse' ? '/mouse2.png' : '/rat2.png'"
            class="rodent"
            :style="`left:${r.x}%; bottom:${r.y}%;`"
        />
    </div>
</template>

<style scoped>
/* Timer clock styles */
.timer-clock {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
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

.map-image {
  width: 100%;
  height: auto;
  max-width: 90vw;
  max-height: 80vh;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  border-radius: 8px;
}

.cat {
  position: absolute;
  width: 64px;
  z-index: 100;
  transition: left 0.08s ease-out;
}

.rodent {
  position: absolute;
  width: 100px;
  z-index: 60;
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

.game-btn {
  font-size: 1.2rem;
  padding: 5px 10px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e42 100%);
  color: #222;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s;
}

.game-btn:hover {
  background: linear-gradient(90deg, #f59e42 0%, #fbbf24 100%);
}
</style>