import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: 'djddpuxvi',
  api_key: '184833774157914',
  api_secret: 'qOyoz61dBSukLHYYm5nYVo6vAsI' // Click 'View API Keys' above to copy your API secret
});

export async function cloudinaryUploader(buffer, folder = "book") {
  // Configuration
  const uploadResult = await new Promise((resolve) => {
    cloudinary.uploader.upload_stream({ resource_type: "image", unique_filename: true, folder }, (error, uploadResult) => {
      return resolve(uploadResult);
    }).end(buffer);
  });
  return uploadResult;
};

export async function cloudinaryDelete(publicId) {
  // Configuration
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};