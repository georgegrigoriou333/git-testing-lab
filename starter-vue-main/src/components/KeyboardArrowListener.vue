<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
const emit = defineEmits(['direction']);

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    emit('direction', 'left');
  } else if (e.key === 'ArrowRight') {
    emit('direction', 'right');
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>


