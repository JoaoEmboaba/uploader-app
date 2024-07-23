import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import axios from 'axios';
import { enviroment } from 'enviroments/enviroment'

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  selectFile: File | null = null;
  uploadProgress: number = 0;
  apiEndpoint: any = enviroment.API_ENDPOINT_URL;

  handleFileChange(event: any) {
    this.selectFile = event.target.files[0];
  }

  async getPresignedUrl() : Promise<string> {
    try {
      const response = await axios.get(this.apiEndpoint);
      const presignedUrl: string = response.data.presignedUrl;
      console.log(presignedUrl);
      return presignedUrl;
    } catch(error: any) {
      console.error('Erro ao consultar/gerar URL pré assinada', error);
      throw error;
    }
  }

  async uploadToPresignedUrl(presignedUrl: string) {
    try {
      const uploadResponse = await axios.put(presignedUrl, this.selectFile, {
        headers: {
          'Content-Type': 'application/png'
        },
        onUploadProgress: (progressEvent: any) => {
          this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(progressEvent);
          console.log(`Upload Progress: ${this.uploadProgress}%`);
        }
      });
      console.log(uploadResponse);
    } catch(error: any) {
      console.error('Erro fazendo o upload do arquivo: ', error);
      throw error;
    }
    this.uploadProgress = 100;
  }


  async handleUpload() {
    try {
      if (!this.selectFile) {
        window.alert('Nenhum arquivo selecionado');
        return;
      }
      const preSignedUrl = await this.getPresignedUrl();
      await this.uploadToPresignedUrl(preSignedUrl);
    } catch(error: any) {
      console.error('Erro realizando o upload', error);
    }
  }
}
