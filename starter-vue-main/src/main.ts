// main.ts
import './assets/css/main.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './router/routes'
import messages from './locales/locales'
import { createI18n, I18nOptions } from 'vue-i18n'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'

// i18n setup
const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
};
const i18n = createI18n(i18nOptions)

// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create Vue app
const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(ui)

app.mount('#app')
