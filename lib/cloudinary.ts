import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Завантаження зображення з base64 або URL
export const uploadImage = async (image: string, folder?: string) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: folder || process.env.CLOUDINARY_FOLDER,
      transformation: [
        { width: 500, height: 500, crop: 'limit', quality: 'auto' }
      ]
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Помилка завантаження в Cloudinary:', error);
    throw error;
  }
};

// Видалення зображення
export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Помилка видалення зображення:', error);
    throw error;
  }
};

// Видалення кількох зображень
export const deleteMultipleImages = async (publicIds: string[]) => {
  try {
    const results = await Promise.all(
      publicIds.map(id => cloudinary.uploader.destroy(id))
    );
    return results;
  } catch (error) {
    console.error('Помилка видалення зображень:', error);
    throw error;
  }
};

export default cloudinary;