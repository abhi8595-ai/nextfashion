<!--app/components/ProductCard.vue-->
<script setup>
const localePath = useLocalePath();

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
});

const safeProduct = product => ({
  ...product,
  galleryImages: product?.galleryImages?.nodes?.[0] ?? {},
  image: product?.image ?? {},
  allPaStyle: product?.allPaStyle?.nodes?.[0] ?? {},
});
</script>

<template>
  <article v-for="(product, index) in (props.products || []).filter(Boolean)" :key="product?.slug || product?.sku || index">
    <NuxtLink :to="localePath(`/product/${product?.slug}-${(product?.sku || '').split('-')[0]}`)" class="group select-none">
      <div class="cursor-pointer transition ease-[ease] duration-300">
        <div class="relative pb-[133%] dark:shadow-[0_8px_24px_rgba(0,0,0,.5)] rounded-2xl overflow-hidden">
          <img
            :alt="product?.name || 'Product image'"
            loading="lazy"
            :title="product?.name || 'Product'"
            :src="product?.galleryImages?.nodes?.[0]?.sourceUrl || product?.image?.sourceUrl || '/logo.svg'"
            class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover" />
          <img
            :alt="product?.name || 'Product image'"
            loading="lazy"
            :title="product?.name || 'Product'"
            :src="product?.image?.sourceUrl || product?.galleryImages?.nodes?.[0]?.sourceUrl || '/logo.svg'"
            class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover transition-opacity duration-300 group-hover:opacity-0" />
        </div>
        <div class="grid gap-0.5 pt-3 pb-4 px-1.5 text-sm font-semibold">
          <ProductPrice :sale-price="product?.salePrice" :regular-price="product?.regularPrice" variant="card" />
          <div>{{ product?.name }}</div>
          <div class="font-normal text-[#5f5f5f] dark:text-[#a3a3a3]">
            {{ safeProduct(product).allPaStyle?.name || '' }}
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
