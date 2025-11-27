<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
const emit = defineEmits(['direction']);

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    emit('direction', 'left');
  } else if (e.key === 'ArrowRight') {
    emit('direction', 'right');
  } else if (e.key === 'ArrowUp') {
    emit('direction', 'up');
  } else if (e.key === 'ArrowDown') {
    emit('direction', 'down');
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>


