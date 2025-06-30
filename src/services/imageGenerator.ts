
import { STABILITY_API_KEY } from "astro:env/client";

// Function to generate a bouquet image using Stability AI
// Takes an array of flower names and returns a base64 encoded image  as a data URL
// Returns null if the image generation fails or if the API key or URL is missing

export async function generateBouquetImage(flowers: string[]): Promise<string | null> {
  
  
  if (!STABILITY_API_KEY) {
    console.error('API key or URL not found. Make sure you have:',
      '\n1. Created a .env file in your project root',
      '\n2. Added STABILITY_API_KEY',
      '\n3. Restarted your development server');
    throw new Error('Missing Stability AI API key. Please check your .env file.');
  }

  const prompt = `A beautiful professional photograph of a miniature hand-held flower bouquet containing only one of each of the following flowers: ${flowers.join(", ")}, 
    detailed, high resolution, studio lighting, small hand-held nosegay, centered composition, presented as a small ribbon-tied bouquet with only one of each of the named flowers, gathered into a small cone-shaped silver metal victorian-style tussie mussie bouquet holder decorated with a frill of lace and tied with dangling ribbons. Do not show a hand or any part of a human being or person, only show the bouquet.`;

  try {
    
    const response = await fetch(`https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        steps: 30,
        width: 1024,
        height: 1024,
        samples: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API request failed: ${error.message}`);
    }

    const data = await response.json();
    // Stability AI returns base64 encoded images
    const base64Image = data.artifacts[0].base64;
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}