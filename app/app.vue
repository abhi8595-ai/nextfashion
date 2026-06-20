<!--app/app.vue-->
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
const { site } = useAppConfig();
const { name, description } = site;

useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: (chunk?: string) => (chunk ? `${chunk} - ${name}` : name),
});

useSeoMeta({
  description,
  ogType: 'website',
  ogSiteName: name,
  ogLocale: 'en_US',
  ogImage: 'https://commerce.nuxt.dev/social-card.jpg',
  twitterCard: 'summary_large_image',
  twitterSite: '@zhatlen',
  twitterCreator: '@zhatlen',
  twitterImage: 'https://commerce.nuxt.dev/social-card.jpg',
  keywords: `${name}, ecommerce, nuxt, woocommerce`,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
});

const setVh = () => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
};

onMounted(() => {
  setVh();
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', setVh);
});

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('resize', setVh);
  window.removeEventListener('orientationchange', setVh);
});
</script>

<template>
  <AppHeader />
  <main style="min-height: calc(var(--vh, 1vh) * 100 - 72px);">
    <NuxtPage />
  </main>
  <AppFooter />
  <Notivue v-slot="item">
    <Notification :item="item" :theme="materialTheme" />
  </Notivue>
</template>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Ude+Figg&family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'Inter', sans-serif;
}

.dark {
  @apply bg-black text-neutral-100;
  color-scheme: dark;
}
.dropdown-enter-active {
  @apply transition duration-200 ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  @apply translate-y-5 opacity-0;
}
.dropdown-enter-to,
.dropdown-leave-from {
  @apply transform opacity-100;
}
.dropdown-leave-active {
  @apply transition duration-150 ease-in;
}
</style>
