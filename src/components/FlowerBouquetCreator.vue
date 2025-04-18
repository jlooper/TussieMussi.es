<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-2/3">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex border-b border-gray-200 mb-6">
          <button
            class="py-2 px-4 font-medium text-sm"
            :class="{
              'text-purple-600 border-b-2 border-purple-600': activeTab === 'manual',
              'text-gray-500 hover:text-gray-700': activeTab !== 'manual',
            }"
            @click="activeTab = 'manual'"
          >
            Manual Selection
          </button>
          <button
            class="py-2 px-4 font-medium text-sm"
            :class="{
              'text-purple-600 border-b-2 border-purple-600': activeTab === 'meaning',
              'text-gray-500 hover:text-gray-700': activeTab !== 'meaning',
            }"
            @click="activeTab = 'meaning'"
          >
            Create by Meaning
          </button>
        </div>

        <div v-if="activeTab === 'manual'">
          <h2 class="text-2xl font-semibold text-purple-800 mb-4">Select Flowers</h2>

          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <input
                type="text"
                :placeholder="`Search by ${filterBy}...`"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                v-model="searchTerm"
              />
            </div>
            <div class="sm:w-48">
              <select
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                v-model="filterBy"
              >
                <option value="name">Filter by Name</option>
                <option value="meaning">Filter by Meaning</option>
              </select>
            </div>
          </div>

          <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
          <div v-else>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <FlowerCard
                v-for="flower in paginatedFlowers"
                :key="flower.id"
                :flower="flower"
                :onAddToBouquet="() => addFlowerToBouquet(flower)"
                :isInBouquet="selectedFlowers.some(f => f.id === flower.id)"
              />
            </div>
            
            <!-- Pagination Controls -->
            <div class="flex justify-center items-center gap-2 mt-4">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                :class="{
                  'bg-gray-200 text-gray-500 cursor-not-allowed': currentPage === 1,
                  'bg-purple-600 text-white hover:bg-purple-700': currentPage > 1,
                }"
              >
                Previous
              </button>
              
              <span class="text-sm text-gray-600">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                :class="{
                  'bg-gray-200 text-gray-500 cursor-not-allowed': currentPage === totalPages,
                  'bg-purple-600 text-white hover:bg-purple-700': currentPage < totalPages,
                }"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div v-else>
          <MeaningBasedCreator
            :flowers="flowers"
            :onCreateBouquet="setFlowersByMeaning"
            :isLoading="isLoading"
          />
        </div>
      </div>
    </div>

    <div class="lg:w-1/3">
      <BouquetPreview
        :selectedFlowers="selectedFlowers"
        :onRemoveFlower="removeFlowerFromBouquet"
        :onClearBouquet="clearBouquet"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import FlowerCard from "./FlowerCard.vue";
import BouquetPreview from "./BouquetPreview.vue";
import MeaningBasedCreator from "./MeaningBasedCreator.vue";

const flowers = ref([]);
const selectedFlowers = ref([]);
const searchTerm = ref("");
const filterBy = ref("name");
const isLoading = ref(true);
const activeTab = ref("manual");
const currentPage = ref(1);
const flowersPerPage = 6;

const fetchFlowers = async () => {
  try {
    const response = await fetch("/flowers.json");
    if (!response.ok) {
      throw new Error("Failed to fetch flowers data");
    }
    const data = await response.json();
    flowers.value = data;
  } catch (error) {
    console.error("Error fetching flowers:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchFlowers);

// Reset to first page when search term or filter changes
watch([searchTerm, filterBy], () => {
  currentPage.value = 1;
});

const filteredFlowers = computed(() => {
  return flowers.value.filter((flower) => {
    if (filterBy.value === "name") {
      return flower.name
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());
    } else {
      return flower.meaning
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());
    }
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredFlowers.value.length / flowersPerPage);
});

const paginatedFlowers = computed(() => {
  const start = (currentPage.value - 1) * flowersPerPage;
  const end = start + flowersPerPage;
  return filteredFlowers.value.slice(start, end);
});

const addFlowerToBouquet = (flower) => {
  selectedFlowers.value.push(flower);
};

const removeFlowerFromBouquet = (flowerId) => {
  selectedFlowers.value = selectedFlowers.value.filter(
    (flower) => flower.id !== flowerId
  );
};

const clearBouquet = () => {
  selectedFlowers.value = [];
};

const setFlowersByMeaning = (newFlowers) => {
  selectedFlowers.value = newFlowers;
};
</script>