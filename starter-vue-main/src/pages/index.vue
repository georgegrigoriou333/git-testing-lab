<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
</script>

<template>
	<UContainer class="flex justify-center items-center min-h-screen">
		<UCard class="max-w-md w-full">
			<template #header>
				<h1 class="text-2xl font-bold text-center">{{ t('greeting') }}</h1>
			</template>
		</UCard>
	</UContainer>
</template>