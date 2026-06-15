<!-- app/components/AppFooter.vue -->

<script setup>
const colorMode = useColorMode();
const localePath = useLocalePath();
const { locale, locales, setLocale } = useI18n();

const isOpen = ref(false);
const dropdownRef = ref();

const toggleDark = () => {
  colorMode.preference =
    colorMode.value === 'dark'
      ? 'light'
      : 'dark';
};

const colorModeIcon = computed(() =>
  colorMode.preference === 'dark'
    ? 'i-iconamoon-mode-dark-fill'
    : 'i-iconamoon-mode-light-fill'
);

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const currentLocale = computed(() =>
  locales.value.find(l => l.code === locale.value)
);

const chooseLocale = code => {
  setLocale(code);
  isOpen.value = false;
};
</script>

<template>
  <footer class="mt-8 border-t border-black/10 bg-white/80 px-4 pb-8 pt-8 text-sm text-neutral-700 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/80 dark:text-neutral-200 lg:px-6">
    <div class="mx-auto flex max-w-7xl flex-col gap-8">
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr]">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#b31015] shadow-lg shadow-red-900/20">
              <img class="h-8 w-8 rounded-xl" src="/logo.svg" alt="Lane 9 logo" />
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">Premium Store</p>
              <h3 class="brand-mark text-2xl font-black uppercase tracking-[0.28em] text-neutral-900 dark:text-white md:text-[1.9rem]">Lane 9</h3>
            </div>
          </div>
          <p class="max-w-md text-sm text-neutral-600 dark:text-neutral-300">
            Discover curated essentials, premium pieces, and a smooth shopping experience designed for modern customers.
          </p>
          <div class="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span class="rounded-full border border-black/10 bg-black/5 px-3 py-1 dark:border-white/10 dark:bg-white/10">Fast shipping</span>
            <span class="rounded-full border border-black/10 bg-black/5 px-3 py-1 dark:border-white/10 dark:bg-white/10">Secure checkout</span>
            <span class="rounded-full border border-black/10 bg-black/5 px-3 py-1 dark:border-white/10 dark:bg-white/10">24/7 support</span>
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-black uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Navigate</h4>
          <ul class="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
            <li><NuxtLink :to="localePath('/')" class="transition hover:text-black hover:dark:text-white">Home</NuxtLink></li>
            <li><NuxtLink :to="localePath('/categories')" class="transition hover:text-black hover:dark:text-white">Categories</NuxtLink></li>
            <li><NuxtLink :to="localePath('/favorites')" class="transition hover:text-black hover:dark:text-white">Favorites</NuxtLink></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-black uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Support</h4>
          <ul class="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
            <li>hello@lane9.example</li>
            <li>+1 (555) 010-2040</li>
            <li>Mon–Fri • 9:00–18:00</li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-black uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Preferences</h4>
          <div class="flex flex-wrap gap-2">
            <button type="button" @click="toggleDark" class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-2 text-sm font-semibold transition hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/10 hover:dark:bg-white/20 hover:dark:text-white">
              <UIcon :name="colorModeIcon" size="16" />
              {{ $t('theme.' + colorMode.preference) }}
            </button>

            <div v-if="locales?.length > 1" class="relative" ref="dropdownRef">
              <button type="button" @click="isOpen = !isOpen" class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-2 text-sm font-semibold transition hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/10 hover:dark:bg-white/20 hover:dark:text-white">
                <UIcon name="i-iconamoon-flag-fill" size="16" />
                {{ currentLocale?.name || locale }}
              </button>
              <Transition name="dropdown">
                <div v-if="isOpen" class="absolute bottom-full right-0 z-10 mb-3 w-44 rounded-2xl bg-white p-2 text-sm font-semibold shadow-[0_18px_40px_rgba(0,0,0,0.18)] dark:bg-[#1b1b1b]">
                  <button v-for="item in locales" :key="item.code" type="button" @click="chooseLocale(item.code)" class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-black transition hover:bg-black/5 dark:text-white hover:dark:bg-white/10">
                    <span>{{ item.name }}</span>
                    <UIcon v-if="locale === item.code" name="i-iconamoon-check-circle-1-fill" size="18" />
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 border-t border-black/10 pt-5 text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-400 lg:flex-row lg:items-center lg:justify-between">
        <div>© {{ new Date().getFullYear() }} Lane 9. All rights reserved.</div>
        <div class="flex flex-wrap items-center gap-3">
          <span>Secure payments</span>
          <span>•</span>
          <span>Trusted quality</span>
          <span>•</span>
          <span>Premium support</span>
        </div>
      </div>
    </div>
  </footer>
</template>
