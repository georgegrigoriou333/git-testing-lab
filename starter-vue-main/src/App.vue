<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useStorage } from "@vueuse/core";
import type { NavigationMenuItem } from "@nuxt/ui";
import { useI18n } from "vue-i18n";
import type { Locale } from "./locales/locales";

const { t } = useI18n();

const { locale } = useI18n<{ locale: Locale }>();
const storedLocale = useStorage<Locale>("locale", locale.value as Locale);
locale.value = storedLocale.value;

onMounted(() => {
  console.log("[i18n] Locale set to:", locale.value);
});

function toggleLocale() {
  storedLocale.value = storedLocale.value === "en" ? "el" : "en";
  locale.value = storedLocale.value;
}

const localeLabel = computed(() =>
  storedLocale.value === "en" ? "🇬🇧 English" : "🇬🇷 Ελληνικά"
);

const open = ref(false);

const links: NavigationMenuItem[][] = [
  [
    {
      title: t("dashboard"),
      label: t("dashboard"),
      icon: "i-lucide-home",
      to: "/",
    },
    {
      title: t("about"),
      label: t("about"),
      icon: "i-lucide-info",
      // to: "/about",
    },
  ],
  [
    {
      title: t("settings"),
      label: t("settings"),
      icon: "i-lucide-settings",
      // to: "/settings",
    },
  ],
];
</script>

<template>
  <Suspense>
    <UApp>
      <!-- Header with Logo and Light/Dark Switch -->
      <UHeader>
        <template #left>
          <RouterLink to="/">
            <AppLogo class="w-auto h-6 shrink-0 -ml-30" />
          </RouterLink>
        </template>
        <template #right>
          <UColorModeButton />
        </template>
      </UHeader>

      <UDashboardGroup unit="rem" storage="local">
        <!-- Sidebar -->
        <UDashboardSidebar
          id="default"
          v-model:open="open"
          collapsible
          resizable
          class="bg-elevated/25 relative"
          :ui="{ footer: 'lg:border-t lg:border-default' }"
        >
          <!-- Sidebar Header -->
          <template #header="{ collapsed }">
            <div
              class="flex items-center justify-center h-12 px-4 border-b border-default"
            >
              <AppLogo
                class="w-auto h-15"
                :class="collapsed ? 'h-8' : 'h-15'"
              />
            </div>
          </template>

          <!-- Sidebar Main Content -->
          <template #default="{ collapsed }">
            <!-- Main Navigation -->
            <UNavigationMenu
              :collapsed="collapsed"
              :items="links[0]"
              orientation="vertical"
              tooltip
              popover
            />

            <!-- Secondary Navigation -->
            <UNavigationMenu
              :collapsed="collapsed"
              :items="links[1]"
              orientation="vertical"
              tooltip
              class="mt-auto"
            />

            <!-- Locale Toggle -->
            <div class="border-t border-default mt-0" />
            <UButton
              color="secondary"
              variant="ghost"
              block
              class="justify-items-center"
              icon="i-lucide-globe"
              @click="toggleLocale"
            >
              {{ localeLabel }}
            </UButton>
          </template>

          <!-- Sidebar Footer -->
          <template #footer="{ collapsed }">
            <div
              class="flex items-center justify-center h-12 px-4 border-t border-default"
            >
              <span
                v-if="!collapsed"
                class="text-sm text-center select-none"
              >
                &copy; 2025 The Waste Game
              </span>
            </div>
          </template>
        </UDashboardSidebar>

        <!-- Main Content -->
        <Transition name="fade" mode="out-in">
          <RouterView :key="String($route.fullPath)" />
        </Transition>

      </UDashboardGroup>
    </UApp>
  </Suspense>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>