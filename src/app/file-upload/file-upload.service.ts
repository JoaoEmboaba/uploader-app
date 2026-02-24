import axios from 'axios';

export class FileUploadService {
  async getPresignedUrl(apiEndpoint: string, params: any): Promise<string> {
    const response = await axios.get(apiEndpoint, { params });
    return response.data.presignedUrl;
  }

  async uploadFile(presignedUrl: string, file: File, onUploadProgress: (progressEvent: any) => void): Promise<void> {
    return await axios.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress,
    });
  }
}