import axios from "axios";
import toast from "react-hot-toast";

export const uploadService = {
    uploadFile: async (file: File, resourceType: 'image' | 'raw' | 'auto' = 'auto', onProgress?: (progress: number) => void): Promise<{ url: string; public_id: string }> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rs_demo_unsigned");
        formData.append("resource_type", resourceType);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        if (onProgress && progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            onProgress(percentCompleted);
                        }
                    }
                }
            );

            return {
                url: response.data.secure_url,
                public_id: response.data.public_id
            };
        } catch (error) {
            console.error("Upload error:", error);
            throw new Error("Failed to upload file");
        }
    }
};
