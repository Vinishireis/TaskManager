import axios from "axios";

const uploadImage = async (imageFile) => {
  console.log("🔍 imageFile recebido:", imageFile);

  const formData = new FormData();
  formData.append("image", imageFile); // <- nome correto aqui

  try {
    const response = await axios.post("http://localhost:8000/api/auth/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Erro no upload de imagem", error);
    throw error;
  }
};

export default uploadImage;
