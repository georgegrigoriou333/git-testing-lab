<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import HistoryDiagram from '../components/HistoryDiagram.vue';
import KeyboardArrowListener from '../components/KeyboardArrowListener.vue';

const { t } = useI18n()
const direction = ref('');

function handleDirection(dir: string) {
	direction.value = dir;
	setTimeout(() => direction.value = '', 200);
}
</script>

<template>
	<UContainer class="flex flex-col justify-center items-center min-h-screen gap-8">
		<UCard class="max-w-md w-full">
			<template #header>
				<h1 class="text-2xl font-bold text-center">{{ t('greeting') }}</h1>
			</template>
			<p class="text-center">{{ t('description') }}</p>
		</UCard>
		<KeyboardArrowListener @direction="handleDirection" />
		<HistoryDiagram :direction="direction" />
	</UContainer>
</template>