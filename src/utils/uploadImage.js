// utils/uploadImage.js
import axios from "axios";

const uploadImage = async (image) => {
  try {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_APP_CLOUDINARY_NAME
    }/image/upload`;
    // const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dlbflgtdr/image/upload`;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mern_product");

    const response = await axios.post(cloudinaryUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export default uploadImage;
