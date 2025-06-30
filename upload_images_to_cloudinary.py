import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
API_KEY = os.getenv('CLOUDINARY_API_KEY')
API_SECRET = os.getenv('CLOUDINARY_API_SECRET')

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET
)

IMAGES_DIR = 'public/images'

for filename in os.listdir(IMAGES_DIR):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff', '.avif')):
        file_path = os.path.join(IMAGES_DIR, filename)
        public_id = os.path.splitext(filename)[0]
        print(f'Uploading {file_path}...')
        response = cloudinary.uploader.upload(
            file_path,
            folder='flowers',
            public_id=public_id,
            use_filename=True,
            unique_filename=False
        )
        print(f"Uploaded {filename} to {response['secure_url']}") 