<template>
  <div class="bg-white rounded-lg shadow-md p-6 top-6">
    <h2 class="text-2xl font-semibold text-purple-800 mb-4">Your Tussie Mussie</h2>

    <!-- Notification -->
    <div
      v-if="notification.message"
      :class="[
      notificationClass,
      'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md shadow-lg'
      ]"
    >
      {{ notification.message }}
    </div>

    <div v-if="totalFlowers > 0">

      <div class="mb-4">
        <h3 class="font-medium text-gray-700 mb-2">
          Selected Flowers ({{ totalFlowers }})
        </h3>
        <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
          <div
            v-for="flower in selectedFlowers"
            :key="flower.id"
            class="flex items-center justify-between bg-gray-50 p-2 rounded-md"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img
                  :src="`https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/flowers/${flower.image}`"
                  :alt="flower.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <span class="text-sm">{{ flower.name }}</span>
            </div>
            <button
              @click="onRemoveFlower(flower.id)"
              class="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium text-gray-700">Bouquet Meaning</h3>
          <button
            @click="showMeanings = !showMeanings"
            class="text-sm text-purple-600 hover:text-purple-800"
          >
            {{ showMeanings ? "Hide" : "Show" }}
          </button>
        </div>
        <div v-if="showMeanings" class="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
          {{ combinedMeaning }}
        </div>
      </div>

      <div v-if="!imageUrl" class="flex gap-2 mb-4">
        <button
          @click="onClearBouquet"
          class="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          Clear
        </button>
        <button
          @click="handleGenerateImage"
          :disabled="isGenerating"
          class="flex-1 py-2 px-4 text-white rounded-md transition-colors duration-200"
          :class="{
            'bg-purple-400 cursor-not-allowed': isGenerating,
            'bg-purple-600 hover:bg-purple-700': !isGenerating,
          }"
        >
          {{ isGenerating ? "Generating..." : "Generate Image" }}
        </button>
      </div>

      <div v-else class="mb-6">
        <div class="border rounded-lg overflow-hidden mb-4">
          <img :src="imageUrl" alt="a tussie mussie just for you" class="w-full h-auto" />
        </div>
        <div class="flex gap-2">
          <button
            @click="resetImage"
            class="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Back
          </button>
          <button
            @click="downloadImage"
            class="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            Download
          </button>
        </div>
      </div>

      <div v-if="showShareOptions" class="mt-4 p-4 bg-purple-50 rounded-lg">
        <h3 class="font-medium text-gray-700 mb-2">Share Your Bouquet</h3>
        <p class="text-sm text-gray-600 mb-3">
          Your bouquet expresses: {{ combinedMeaning }}
        </p>
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Personal Message</label>
            <textarea
              v-model="personalMessage"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Add a personal message for your recipient..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
            <input
              type="email"
              v-model="from"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recipient's Email</label>
            <input
              type="email"
              v-model="to"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter recipient's email address"
            />
          </div>

          <div class="flex gap-2">
            <button
              @click="shareECard"
              class="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
            >
              Share E-Card
            </button>
          </div>
        </div>
      </div>

 
    </div>

    <div v-else class="text-center py-12 text-gray-500">
      <p class="mb-4">Your bouquet is empty</p>
      <p class="text-sm">Select flowers to create a meaningful bouquet</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { generateBouquetImage } from "../services/imageGenerator";
import { uploadToCloudinary } from "../utils/cloudinary";
import Mailgun from "mailgun.js";

export default {
  name: "BouquetPreview",
  props: {
    selectedFlowers: {
      type: Array,
      required: true,
    },
    onRemoveFlower: {
      type: Function,
      required: true,
    },
    onClearBouquet: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const showMeanings = ref(true);
    const showShareOptions = ref(false);
    const imageUrl = ref(null);
    const isGenerating = ref(false);
    const personalMessage = ref("");
    const to = ref("");
    const from = ref("");

    const notification = ref({ message: "", type: "" });

    const totalFlowers = computed(() => props.selectedFlowers.length);
    const combinedMeaning = computed(() =>
      props.selectedFlowers.map((f) => f.meaning).join(". ")
    );

    const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;

    watch(
      () => props.selectedFlowers,
      () => {
        imageUrl.value = null;
        showShareOptions.value = false;
      }
    );

    const handleGenerateImage = async () => {
      if (props.selectedFlowers.length === 0) return;

      try {
        isGenerating.value = true;
        const flowerNames = props.selectedFlowers.map((flower) => flower.name);
        const generatedImageUrl = await generateBouquetImage(flowerNames);
        if (generatedImageUrl) {
          imageUrl.value = generatedImageUrl;
          showShareOptions.value = true;
        } else {
          throw new Error("Failed to generate image");
        }
      } catch (error) {
        console.error("Error generating image:", error);
        showNotification("Failed to generate image.", "error");
      } finally {
        isGenerating.value = false;
      }
    };

    const showNotification = (message, type) => {
      notification.value = { message, type };
      setTimeout(() => {
        notification.value = { message: "", type: "" };
      }, 3000); // Clear notification after 3 seconds
    };

    const notificationClass = computed(() => {
      return notification.value.type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    });

    const downloadImage = () => {
      if (imageUrl.value) {
        const link = document.createElement("a");
        link.href = imageUrl.value;
        link.download = `tussie-mussie.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    const resetImage = () => {
      imageUrl.value = null;
      showShareOptions.value = false;
    };

    const shareECard = async () => {
      if (!to.value) {
        showNotification("Please enter a recipient's email address", "error");
        return;
      }
      if (!from.value) {
        showNotification("Please enter your email address", "error");
        return;
      }

      try {
        // First, upload the image to Cloudinary if it exists
        let imageDownloadUrl = null;
        if (imageUrl.value) {
          try {
            imageDownloadUrl = await uploadToCloudinary(imageUrl.value);
          } catch (uploadError) {
            console.error('Error uploading to Cloudinary:', uploadError);
            // Continue with e-card sending even if image upload fails
          }
        }

        // Call Mailgun directly
        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
          username: "api",
          key: import.meta.env.PUBLIC_MAILGUN_API_KEY
        });

        try {
          const result = await mg.messages.create(import.meta.env.PUBLIC_MAILGUN_DOMAIN, {
            from: `Flora <postmaster@${import.meta.env.PUBLIC_MAILGUN_DOMAIN}>`,
            to: [to.value],
            subject: `Your Tussie Mussie from ${from.value}`,
            text: personalMessage.value || "Sending you this beautiful bouquet to brighten your day!",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4a5568; text-align: center;">You've got flowers!</h2>
                ${imageDownloadUrl ? `
                  <div style="text-align: center; margin: 20px 0;">
                    <img src="${imageDownloadUrl}" alt="Bouquet" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
                  </div>
                ` : ''}
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #2d3748; font-size: 16px; line-height: 1.6;">${personalMessage.value || "Sending you this beautiful bouquet to brighten your day!"}</p>
                </div>
                <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
                  <h3 style="color: #4a5568; margin-bottom: 10px;">Your Bouquet Meaning from the Tussie Mussie Generator</h3>
                  <p style="color: #2d3748; font-size: 14px; line-height: 1.5;">${combinedMeaning.value}</p>
                  <p style="color: #2d3748; font-size: 14px; line-height: 1.5; text-italics">Tussie Mussies are a traditional way to express secret thoughts, encoded using the language of flowers, or "floriography".</p>
                </div>
                <div style="margin-top: 30px; text-align: center;">
                  <p style="color: #718096; font-size: 14px;">Created with the Tussie Mussie Generator. 
                    Create your own bouquAI <a href="https://tussie-mussies.netlify.app">here</a>! If you enjoy this experience, please follow the creator, Beanpot Studio: <a href="https://www.linkedin.com/company/beanpot-studio">on LinkedIn</a>.</p>
                </div>
              </div>
            `
          });


          // Clear the form
          to.value = '';
          from.value = '';
          personalMessage.value = '';
          showShareOptions.value = false;
          showNotification("E-card sent successfully!", "success");
        } catch (error) {
          console.error("Error sending e-card:", error);
          showNotification(error.message || "Failed to send e-card. Please try again.", "error");
        }
      } catch (error) {
        console.error("Error sending e-card:", error);
        showNotification("Failed to send e-card. Please try again.", "error");
      }
    };

    return {
      showMeanings,
      showShareOptions,
      imageUrl,
      isGenerating,
      totalFlowers,
      combinedMeaning,
      handleGenerateImage,
      notification,
      notificationClass,
      downloadImage,
      resetImage,
      personalMessage,
      to,
      shareECard,
      from,
      cloudName,
    };
  },
};
</script>