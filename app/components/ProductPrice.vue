<script setup lang="ts">
import type { Money } from '../../shared/types';

type PriceVariant = 'default' | 'card' | 'cart';

interface Props {
  salePrice?: Money | null;
  regularPrice?: Money | null;
  variant?: PriceVariant;
  quantity?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  quantity: 1,
});

const parsePrice = (priceValue: Money | null | undefined): number => {
  if (priceValue === null || priceValue === undefined || priceValue === '') return 0;
  const value = String(priceValue).replace(/[^0-9.]/g, '');
  return Number.isFinite(Number(value)) ? Number(value) : 0;
};

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const formatPrice = (value: number) => priceFormatter.format(value);

const salePriceValue = computed(() => parsePrice(props.salePrice));
const regularPriceValue = computed(() => parsePrice(props.regularPrice));
const totalSalePrice = computed(() => salePriceValue.value * props.quantity);
const totalRegularPrice = computed(() => regularPriceValue.value * props.quantity);

const formattedSalePrice = computed(() => formatPrice(salePriceValue.value));
const formattedRegularPrice = computed(() => formatPrice(regularPriceValue.value));
const formattedTotalSalePrice = computed(() => formatPrice(totalSalePrice.value));
const formattedTotalRegularPrice = computed(() => formatPrice(totalRegularPrice.value));

const isSale = computed(() => salePriceValue.value > 0 && regularPriceValue.value > 0 && salePriceValue.value < regularPriceValue.value);

const discountPercentage = computed(() => {
  if (!isSale.value) return 0;
  return Math.round(((regularPriceValue.value - salePriceValue.value) / regularPriceValue.value) * 100);
});
</script>

<template>
  <div>
    <div v-if="variant === 'default'">
      <div v-if="isSale">
        <div class="flex items-baseline">
          <p class="text-xl font-bold text-alizarin-crimson-700">{{ formattedSalePrice }}</p>
        </div>
        <div class="flex items-baseline">
          <p class="text-sm">{{ $t('product.originally') }}:</p>
          <p class="text-sm ml-1 line-through">{{ formattedRegularPrice }}</p>
          <p class="text-sm ml-1 text-alizarin-crimson-700">-{{ discountPercentage }}%</p>
        </div>
      </div>
      <div v-else>
        <div class="flex items-baseline">
          <p class="text-xl font-bold">{{ formattedRegularPrice }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="variant === 'card'" class="flex gap-1">
      <template v-if="isSale">
        <span>{{ formattedSalePrice }}</span>
        <span class="text-[#5f5f5f] dark:text-[#a3a3a3] line-through">{{ formattedRegularPrice }}</span>
      </template>
      <template v-else>
        <span>{{ formattedRegularPrice }}</span>
      </template>
    </div>

    <div v-else-if="variant === 'cart'">
      <div v-if="isSale" class="gap-1 flex flex-col">
        <div class="font-bold">{{ formattedTotalSalePrice }}</div>
        <div class="flex-wrap text-neutral-600 dark:text-neutral-300 items-baseline text-xs gap-1 flex-row flex">
          <p>{{ $t('product.originally') }}:</p>
          <p class="line-through">{{ formattedTotalRegularPrice }}</p>
          <p class="text-alizarin-crimson-700">-{{ discountPercentage }}%</p>
        </div>
      </div>
      <div v-else>
        <div class="font-bold">{{ formattedTotalRegularPrice }}</div>
      </div>
    </div>
  </div>
</template>
