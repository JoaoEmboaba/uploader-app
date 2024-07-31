import { Component } from '@angular/core';
import axios from 'axios';
import { enviroment } from 'enviroments/enviroment'

interface matProgressBar {

}

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})

export class FileUploadComponent {
  selectFile: File | null = null;
  uploadProgress: number = 0;
  preSignedUrl: string = "";
  apiEndpoint: any = enviroment.API_ENDPOINT_URL;
  isDragOver = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer) {
      this.selectFile = event.dataTransfer.files[0];
    }
  }

  handleFileChange(event: any) {
    this.selectFile = event.target.files[0];
  }

  async getPresignedUrl() : Promise<string> {
    try {
      const response = await axios.get(this.apiEndpoint);
      this.preSignedUrl = response.data.presignedUrl;
      console.log(this.preSignedUrl);
      return this.preSignedUrl;
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
      navigator.clipboard.writeText(this.preSignedUrl.split("?")[0]);
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
      await this.uploadToPresignedUrl(await this.getPresignedUrl());
      this.selectFile = null;
      this.uploadProgress = 0;
      window.alert('Upload concluído com sucesso\nA url de download foi copiada para a sua área de transferência');
    } catch(error: any) {
      console.error('Erro realizando o upload', error);
    }
  }
}
