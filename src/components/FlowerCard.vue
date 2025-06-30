<template>
  <div
    class="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
  >
    <div class="h-48 overflow-hidden">
      <img
        :src="`https://res.cloudinary.com/${cloudName}/image/upload/w_250/f_auto,q_auto:eco/flowers/${flower.image}`"
        :alt="flower.name"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold text-purple-800">{{ flower.name }}</h3>
      <p class="text-gray-700 text-sm mb-4">{{ flower.meaning }}</p>
      <button
        @click="onAddToBouquet"
        :disabled="isInBouquet"
        class="w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
        :class="{
          'bg-gray-200 text-gray-500 cursor-not-allowed': isInBouquet,
          'bg-purple-600 text-white hover:bg-purple-700': !isInBouquet,
        }"
      >
        {{ isInBouquet ? 'Added to Bouquet' : 'Add to Bouquet' }}
      </button>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  flower: {
    type: Object,
    required: true,
  },
  onAddToBouquet: {
    type: Function,
    required: true,
  },
  isInBouquet: {
    type: Boolean,
    required: true,
  },
});

const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
</script>