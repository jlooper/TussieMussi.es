import { defineConfig, envField } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), tailwind()],
  env: {
    schema: {
      STABILITY_API_URL: envField.string({ context: "client", access: "public" }),
      STABILITY_API_KEY: envField.string({ context: "client", access: "public" }),
      CLOUDINARY_API_URL: envField.string({ context: "client", access: "public" }),
      CLOUDINARY_PRESET: envField.string({ context: "client", access: "public" }),
      PUBLIC_CLOUDINARY_CLOUD_NAME: envField.string({ context: "client", access: "public" }),
    }
  }
});


