import './assets/css/main.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import messages from './locales/locales'
import { createI18n, I18nOptions } from 'vue-i18n'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
};

const i18n = createI18n(i18nOptions);

const app = createApp(App)

app.use(i18n)

app.use(createRouter({
  routes: [{ path: '/', component: () => import('./pages/index.vue') }],
  history: createWebHistory()
}))

app.use(ui)

app.mount('#app')
