<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 py-8">
    <div class="container mx-auto px-4">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
          Tussie Mussie Generator
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Create a meaningful tussie mussie bouquet by selecting flowers based
          on their traditional meanings in the language of flowers.
        </p>
      </header>

      <FlowerBouquetCreator />
    </div>
  </div>
</template>

<script>
import FlowerBouquetCreator from "./components/FlowerBouquetCreator.vue";

export default {
  name: "App",
  components: {
    FlowerBouquetCreator,
  },
};
</script>
