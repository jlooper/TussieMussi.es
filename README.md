# 💐 Tussie-Mussie Generator

Welcome to **The Tussie-Mussie Generator** – a charming web app that lets you create and share AI-generated Victorian-style digital bouquets (bouquAIs), also known as *tussie-mussies*. Each flower in your arrangement carries a symbolic message, inspired by the historic *language of flowers* 🌸✨ Send your message to your love, your Mom, your friend, or yourself as an e-card!

🖥️ **Create your BouquAI here:** [https://tussie-mussies.netlify.app/](https://tussie-mussies.netlify.app/)

## 🌼 What is a Tussie-Mussie?

A tussie-mussie is a small bouquet traditionally used to convey coded sentiments. Popularized by Queen Victoria, they are the ultimate "love code". With this app, you can recreate this experience and compose your own bouquet using symbolic flowers, then save or share it as a unique, personalized message.

![Preview of a digital bouquet](./bouquet-sample.png)



## ✨ Features

- 🌷 Compose custom bouquets with meaningful flowers
- 📖 Learn what each flower symbolizes
- Create by meaning or individually
- Send your bouquet as an e-card

## Demo

[![Demo video](demo.png)](https://youtu.be/L8H4SnNUeDs) "Demo video")

## 🛠 Tech Stack

- [Astro](https://astro.build/) – static site builder
- [Vue 3](https://vuejs.org/) – bouquet builder component
- [Cloudinary](https://cloudinary.com/) – for storing generated bouquet images
- 🤖 Images generated using [Stability AI](https://stability.ai/)
- ✉️ E-card implementation using [Mailgun](https://mailgun.com)

## 🛠 Environment Variables

To run this app, you need to set up the following environment variables in a `.env` file at the root of your project:

```
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_API_URL=your_cloudinary_api_url
CLOUDINARY_PRESET=your_cloudinary_preset

STABILITY_API_KEY=your_stability_api_key

PUBLIC_MAILGUN_API_KEY=your_mailgun_api_key
PUBLIC_MAILGUN_DOMAIN=your_mailgun_domain
```

- `PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name (used for displaying images in the UI)
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`: Used for uploading images to Cloudinary (server-side or scripts)
- `PUBLIC_MAILGUN_API_KEY` and `PUBLIC_MAILGUN_DOMAIN`: Used for sending e-cards

> **Note:** Only variables prefixed with `PUBLIC_` are available in the browser (client-side code).

When hosting your web site, make sure to save the environment variables according to best practices of your hosting provider.

## 🚀 Running the App

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up your `.env` file** as described above.
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Open your browser** and go to [http://localhost:3000](http://localhost:3000)

To build for production:
```sh
npm run build
npm run preview
```

&copy; Jen Looper - MIT License
