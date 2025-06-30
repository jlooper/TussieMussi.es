<!-- filepath: /Users/jenniferlooper/Documents/tussie.mussies/src/components/MeaningBasedCreator.vue -->
<template>
  <div>
    <h2 class="text-2xl font-semibold text-purple-800 mb-4">Create by Meaning</h2>
    <p class="text-gray-600 mb-6">
      Describe the sentiment you want to express, and we'll create a bouquet that conveys your message.
    </p>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Choose a sentiment (optional)
      </label>
      <select
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        v-model="selectedSentiment"
        @change="updateCustomMeaning"
      >
        <option value="">Select a sentiment</option>
        <option
          v-for="(keywords, sentiment) in sentimentKeywords"
          :key="sentiment"
          :value="sentiment"
        >
          {{ capitalize(sentiment) }}
        </option>
      </select>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Describe your message
      </label>
      <textarea
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
        placeholder="e.g., forgiveness, compassion, and hope"
        v-model="customMeaning"
        @input="clearSelectedSentiment"
      />
    </div>

    <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
      {{ error }}
    </div>

    <button
      @click="findMatchingFlowers"
      :disabled="isLoading || isGenerating"
      class="w-full py-3 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 disabled:bg-purple-300"
    >
      <span v-if="isGenerating" class="flex items-center justify-center">
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Creating Your Bouquet...
      </span>
      <span v-else>Create Bouquet</span>
    </button>

    <div v-if="matchedFlowers.length > 0 && !isGenerating" class="mt-8">
      <h3 class="font-medium text-gray-700 mb-3">
        Selected Flowers for Your Meaning
      </h3>
      <div class="bg-purple-50 p-4 rounded-md">
        <p class="text-sm text-gray-600 mb-4">
          Based on your desired meaning, we've selected these flowers to create
          your bouquet:
        </p>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="flower in matchedFlowers"
            :key="flower.id"
            class="flex items-center bg-white px-3 py-2 rounded-md shadow-sm"
          >
            <div class="w-6 h-6 rounded-full overflow-hidden mr-2">
              <img
                :src="`https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/flowers/${flower.image}`"
                :alt="flower.name"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="text-sm font-medium">{{ flower.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";

export default {
  name: "MeaningBasedCreator",
  props: {
    flowers: {
      type: Array,
      required: true,
    },
    onCreateBouquet: {
      type: Function,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const customMeaning = ref("");
    const selectedSentiment = ref("");
    const matchedFlowers = ref([]);
    const isGenerating = ref(false);
    const error = ref("");
    const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;

    const sentimentKeywords = reactive({
      love: ["love", "passion", "affection", "adoration", "heart"],
      friendship: ["friendship", "joy", "loyalty", "bond"],
      sympathy: ["sympathy", "consolation", "remembrance", "grief"],
      congratulations: ["success", "prosperity", "honor", "achievement"],
      apology: ["forgiveness", "regret", "sorry", "pity", "compassion"],
      gratitude: ["gratitude", "thankful", "appreciation", "thanks"],
      encouragement: ["strength", "faith", "hope", "wisdom", "courage"],
      celebration: ["joy", "happiness", "excitement", "festivity"],
    });

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const updateCustomMeaning = () => {
      if (selectedSentiment.value && sentimentKeywords[selectedSentiment.value]) {
        customMeaning.value = sentimentKeywords[selectedSentiment.value].join(", ");
      }
    };

    const clearSelectedSentiment = () => {
      selectedSentiment.value = "";
    };

    const findMatchingFlowers = () => {
      if (!customMeaning.value.trim()) {
        error.value = "Please enter a meaning or select a sentiment";
        return;
      }

      error.value = "";
      isGenerating.value = true;

      const keywords = customMeaning.value
        .toLowerCase()
        .split(/[,.\s]+/)
        .filter((word) => word.length > 3);

      const matches = [];
      const usedIds = new Set();

      keywords.forEach((keyword) => {
        props.flowers.forEach((flower) => {
          if (
            !usedIds.has(flower.id) &&
            flower.meaning.toLowerCase().includes(keyword)
          ) {
            matches.push(flower);
            usedIds.add(flower.id);
          }
        });
      });

      if (matches.length < 3) {
        props.flowers.forEach((flower) => {
          if (!usedIds.has(flower.id) && matches.length < 5) {
            matches.push(flower);
            usedIds.add(flower.id);
          }
        });
      }

      const finalSelection = matches.slice(0, 5);

      setTimeout(() => {
        matchedFlowers.value = finalSelection;
        props.onCreateBouquet(finalSelection);
        isGenerating.value = false;
      }, 1000);
    };

    return {
      customMeaning,
      selectedSentiment,
      matchedFlowers,
      isGenerating,
      error,
      sentimentKeywords,
      capitalize,
      updateCustomMeaning,
      clearSelectedSentiment,
      findMatchingFlowers,
      cloudName,
    };
  },
};
</script>

