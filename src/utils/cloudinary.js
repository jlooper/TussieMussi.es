import axios from "axios";

import { CLOUDINARY_API_URL } from "astro:env/client";
import { CLOUDINARY_PRESET } from "astro:env/client";

export const uploadToCloudinary = async (imageBase64) => {
  try {
    const formData = new FormData();
    formData.append("file", imageBase64);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    const response = await axios.post(CLOUDINARY_API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Error uploading:", error);
    throw error;
  }
};