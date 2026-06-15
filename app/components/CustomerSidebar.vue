<!-- app/components/CustomerSidebar.vue -->
<script setup lang="ts">
const emit = defineEmits(['close-sidebar']);
const { userDetails, orders, updateProfile, saveProfile } = useCheckout();

const sections = [
  { key: 'profile', label: 'Personal details' },
  { key: 'orders', label: 'Order history' },
  { key: 'support', label: 'Support' },
] as const;

const activeSection = ref<'profile' | 'orders' | 'support'>('profile');
const isEditingProfile = ref(false);
const selectedOrderNumber = ref<string | null>(null);

const saveCustomerDetails = () => {
  saveProfile();
  isEditingProfile.value = false;
};

const startEditingProfile = () => {
  isEditingProfile.value = true;
};

const cancelEditingProfile = () => {
  isEditingProfile.value = false;
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
};

const selectedOrder = computed(() =>
  orders.value.find(order => order.orderNumber === selectedOrderNumber.value) ?? null,
);

const toggleOrder = (orderNumber: string) => {
  selectedOrderNumber.value = selectedOrderNumber.value === orderNumber ? null : orderNumber;
};
</script>

<template>
  <aside class="fixed right-0 top-[72px] z-50 h-[calc(100vh-72px)] w-full max-w-md border-l border-black/10 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/95 lg:top-20 lg:h-[calc(100vh-80px)]">
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between border-b border-black/10 px-4 py-4 dark:border-white/10">
        <div>
          <p class="text-[11px] uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">Customer Profile & orders</p>
          <h3 class="text-xl font-black text-neutral-900 dark:text-white">Profile & orders</h3>
        </div>
        <button
          type="button"
          @click="emit('close-sidebar')"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10 dark:bg-white/10 hover:dark:bg-white/20"
          aria-label="Close customer sidebar">
          <UIcon name="i-iconamoon-close" size="18" />
        </button>
      </div>

      <div class="grid grid-cols-3 gap-1 border-b border-black/10 p-2 dark:border-white/10">
        <button
          v-for="item in sections"
          :key="item.key"
          type="button"
          @click="activeSection = item.key"
          :class="[
            'rounded-2xl px-3 py-2 text-sm font-semibold transition',
            activeSection === item.key
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-black/5 text-neutral-700 hover:bg-black/10 dark:bg-white/10 dark:text-neutral-100 hover:dark:bg-white/20',
          ]">
          {{ item.label }}
        </button>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <section v-if="activeSection === 'profile'" class="space-y-4">
          <div v-if="!isEditingProfile" class="space-y-4">
            <div class="rounded-3xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/10">
              <p class="text-sm text-neutral-600 dark:text-neutral-300">View your saved contact details here. Use the edit option whenever you want to update your profile.</p>
            </div>
            <div class="rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black/20">
              <p class="text-xs uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">Personal details</p>
              <h4 class="mt-2 text-xl font-black text-neutral-900 dark:text-white">{{ [userDetails.firstName, userDetails.lastName].filter(Boolean).join(' ') || 'Your name' }}</h4>
              <dl class="mt-4 space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
                <div>
                  <dt class="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Email</dt>
                  <dd class="mt-1 font-semibold">{{ userDetails.email || 'Not provided yet' }}</dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Phone</dt>
                  <dd class="mt-1 font-semibold">{{ userDetails.phone || 'Not provided yet' }}</dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">City</dt>
                  <dd class="mt-1 font-semibold">{{ userDetails.city || 'Not provided yet' }}</dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Address</dt>
                  <dd class="mt-1 font-semibold">{{ userDetails.address1 || 'Not provided yet' }}</dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Postal code</dt>
                  <dd class="mt-1 font-semibold">{{ userDetails.postcode || 'Not provided yet' }}</dd>
                </div>
              </dl>
            </div>
            <button type="button" @click="startEditingProfile" class="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90 dark:bg-white dark:text-black hover:dark:bg-white/90">Edit details</button>
          </div>

          <div v-else class="space-y-4">
            <div class="rounded-3xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/10">
              <p class="text-sm text-neutral-600 dark:text-neutral-300">Update your personal contact details here. Save when you are done.</p>
            </div>
            <div class="grid gap-3">
              <input v-model="userDetails.firstName" @input="updateProfile({ firstName: userDetails.firstName })" class="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder:text-neutral-400 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="First name" />
              <input v-model="userDetails.lastName" @input="updateProfile({ lastName: userDetails.lastName })" class="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder:text-neutral-400 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="Last name" />
              <input v-model="userDetails.email" @input="updateProfile({ email: userDetails.email })" type="email" class="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder:text-neutral-400 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="Email address" />
              <input v-model="userDetails.phone" @input="updateProfile({ phone: userDetails.phone })" class="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder:text-neutral-400 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="Phone number" />
              <input v-model="userDetails.city" @input="updateProfile({ city: userDetails.city })" class="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder:text-neutral-400 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="City" />
              <input v-model="userDetails.postcode" @input="updateProfile({ postcode: userDetails.postcode })" class="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder:text-neutral-400 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="PIN code" />
              <textarea v-model="userDetails.address1" @input="updateProfile({ address1: userDetails.address1 })" rows="3" class="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder:text-neutral-400 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="Address" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" @click="cancelEditingProfile" class="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-neutral-100 hover:dark:bg-white/20">Cancel</button>
              <button type="button" @click="saveCustomerDetails" class="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90 dark:bg-white dark:text-black hover:dark:bg-white/90">Save details</button>
            </div>
          </div>
        </section>

        <section v-else-if="activeSection === 'orders'" class="space-y-3">
          <div v-if="orders?.length" class="space-y-3">
            <article
              v-for="order in orders"
              :key="order.orderNumber + order.date"
              class="rounded-3xl border border-black/10 bg-black/5 p-4 transition hover:bg-black/10 dark:border-white/10 dark:bg-white/10 hover:dark:bg-white/20"
            >
              <button
                type="button"
                class="w-full text-left"
                @click="toggleOrder(order.orderNumber)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-xs uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">Order #{{ order.orderNumber }}</p>
                    <h4 class="mt-1 text-base font-semibold text-neutral-900 dark:text-white">{{ order.paymentMethodTitle }}</h4>
                  </div>
                  <span class="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold dark:bg-white/10">{{ order.total }}</span>
                </div>
                <p class="mt-3 text-sm text-neutral-600 dark:text-neutral-300">Placed on {{ formatDate(order.date) }}</p>
                <p class="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Click to view full details</p>
              </button>

              <div v-if="selectedOrder?.orderNumber === order.orderNumber" class="mt-4 rounded-2xl border border-black/10 bg-white p-4 text-sm dark:border-white/10 dark:bg-black/20">
                <div class="grid gap-3 text-neutral-700 dark:text-neutral-200">
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-neutral-500 dark:text-neutral-400">Status</span>
                    <strong class="capitalize">{{ order.status || 'Completed' }}</strong>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-neutral-500 dark:text-neutral-400">Payment</span>
                    <strong>{{ order.paymentMethodTitle }}</strong>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                    <strong>{{ order.subtotal || order.total }}</strong>
                  </div>
                  <div v-if="order.shippingTotal" class="flex items-center justify-between gap-3">
                    <span class="text-neutral-500 dark:text-neutral-400">Shipping</span>
                    <strong>{{ order.shippingTotal }}</strong>
                  </div>
                </div>

                <div class="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
                  <p class="text-xs uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">Billing</p>
                  <p class="mt-2 font-semibold text-neutral-900 dark:text-white">{{ order.billing?.firstName || '' }} {{ order.billing?.lastName || '' }}</p>
                  <p class="text-neutral-600 dark:text-neutral-300">{{ order.billing?.email || 'No email on file' }}</p>
                  <p class="text-neutral-600 dark:text-neutral-300">{{ order.billing?.phone || 'No phone on file' }}</p>
                  <p class="text-neutral-600 dark:text-neutral-300">{{ [order.billing?.address1, order.billing?.city, order.billing?.postcode].filter(Boolean).join(', ') || 'Address not provided' }}</p>
                </div>

                <div v-if="order.lineItems?.nodes?.length" class="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
                  <p class="text-xs uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">Items</p>
                  <ul class="mt-2 space-y-2">
                    <li v-for="item in order.lineItems.nodes" :key="`${order.orderNumber}-${item.product?.node?.name}-${item.quantity}`" class="flex items-center justify-between gap-3 rounded-2xl bg-black/5 px-3 py-2 dark:bg-white/10">
                      <span class="text-sm text-neutral-800 dark:text-neutral-100">{{ item.product?.node?.name || 'Item' }} × {{ item.quantity || 1 }}</span>
                      <strong class="text-sm">{{ item.total || '—' }}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="rounded-3xl border border-dashed border-black/10 bg-black/5 p-6 text-center text-sm text-neutral-600 dark:border-white/10 dark:bg-white/10 dark:text-neutral-300">No orders yet. Completed purchases will appear here automatically.</div>
        </section>

        <section v-else class="space-y-4">
          <div class="rounded-3xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/10">
            <p class="text-sm text-neutral-600 dark:text-neutral-300">Need help? Our support team is available to assist with orders, account details, and delivery questions.</p>
          </div>
          <div class="space-y-2 rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black/20">
            <p class="text-sm font-semibold text-neutral-900 dark:text-white">Contact support</p>
            <p class="text-sm text-neutral-600 dark:text-neutral-300">Email: info@weroza.com</p>
            <p class="text-sm text-neutral-600 dark:text-neutral-300">Phone: +7972274363</p>
            <p class="text-sm text-neutral-600 dark:text-neutral-300">Hours: Mon–sun, 9:00–10:00</p>
          </div>
        </section>
      </div>
    </div>
  </aside>
</template>
