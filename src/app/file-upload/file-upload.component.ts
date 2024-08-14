import { Component } from '@angular/core';
import axios from 'axios';
import { enviroment } from 'enviroments/enviroment'
import { MessageService } from 'primeng/api';

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
  acceptedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];

  constructor(private messageService: MessageService) {}

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
        this.messageService.add({
          severity:'warn',
          summary:'Nenhum arquivo selecionado!!',
          closable: false,
          life: 2000,
          icon: 'pi'
        })
        return;
      }

      if(!this.acceptedFileTypes.includes(this.selectFile.type)) {
        this.messageService.add({
          severity:'warn',
          summary:'Tipo de arquivo não suportado!!',
          closable: false,
          life: 2000,
          icon: 'pi'
        })
        this.selectFile = null;
        return;
      }

      if (this.selectFile.size > 100000000) {
        this.messageService.add({
          severity:'warn',
          summary:'O arquivo excedeu o limite de 100MB!!',
          closable: false,
          life: 2000,
          icon: 'pi'
        })
        this.selectFile = null;
        return;
      }

      this.messageService.add({ severity: 'info', summary: 'Iniciando upload...', closable: false, life: 2000, icon: 'pi' });

      await this.uploadToPresignedUrl(await this.getPresignedUrl());
      this.selectFile = null;
      this.uploadProgress = 0;
      if (this.uploadProgress === 0) {
        this.messageService.add({
          severity:'sucess',
          summary: 'Upload concluído com sucesso!',
          closable: false,
          life: 2000,
          icon: 'pi'
        })
      }
    } catch(error: any) {
      console.error('Erro realizando o upload', error);
    }
  }
}
