import { Component } from '@angular/core';
import { enviroment } from 'enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  private readonly MESSAGE_LIFECYCLE_DURATION: number = 2000;
  private readonly MAXIMUM_FILE_SIZE: number = 700000000;
  private readonly FILE_PROGRESS_PERCENTAGE: number = 100;
  private readonly SUCESS_STATUS_CODE: number = 200;
  private readonly REDIRECT_STATUS_CODE: number = 300;

  private operationType: string = 'putObject';
  private apiEndpoint = enviroment.API_ENDPOINT_URL;
  private acceptedFileTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
  ];

  public selectFile: File | null = null;
  public uploadProgress = 0;
  public isDragOver = false;

  constructor(
    private readonly messageService: MessageService,
    private readonly fileUploadService: FileUploadService
  ) {}

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer) {
      this.selectFile = event.dataTransfer.files[0];
    }
  }

  public handleFileChange(event: any) {
    this.selectFile = event.target.files[0];
  }

  public showSupportedFileTypes() {
    return this.uploadProgress === 0 && this.selectFile == null;
  }

  public async handleUpload() {
    try {
      if (this.validateSelectedFile()) {
        this.showMessage('info', 'Iniciando upload...', '');

        const presignedUrl = await this.fileUploadService.getPresignedUrl(
          this.apiEndpoint,
          {
            contentType: this.selectFile?.type,
            key: this.selectFile?.type.split('/')[1],
            fileName: this.selectFile?.name.split('.')[0],
            operationType: this.operationType,
          }
        );

        const response: any = await this.fileUploadService.uploadFile(
          presignedUrl,
          this.selectFile as File,
          (progressEvent) => {
            this.uploadProgress = Math.round(
              (progressEvent.loaded * this.FILE_PROGRESS_PERCENTAGE) /
                progressEvent.total
            );
          }
        );
        console.log(response);
        if (
          response?.status >= this.SUCESS_STATUS_CODE &&
          response?.status < this.REDIRECT_STATUS_CODE
        ) {
          this.showMessage('success', 'Upload concluído com sucesso!', '');
          this.resetUploadState();
        }
        this.resetUploadState();
      }
    } catch (error: any) {
      console.error('Erro durante o upload:', error);
      this.showMessage(
        'error',
        'Erro no upload',
        'Não foi possível concluir o upload.'
      );
    }
  }

  private resetUploadState() {
    this.uploadProgress = 0;
    this.selectFile = null;
  }

  private showMessage(severity: string, summary: string, detail: string, life?: number) {
    this.messageService.add({
      severity,
      summary,
      detail,
      icon: 'pi',
      closable: false,
      life: life || this.MESSAGE_LIFECYCLE_DURATION,
    });
  }

  private validateSelectedFile(): boolean {
    if (!this.selectFile) {
      this.showMessage('warn', 'Nenhum arquivo selecionado!', '');
      return false;
    }

    if (!this.acceptedFileTypes.includes(this.selectFile.type)) {
      this.showMessage('warn', 'Tipo de arquivo não suportado!', '');
      this.selectFile = null;
      return false;
    }

    if (this.selectFile.size > this.MAXIMUM_FILE_SIZE) {
      this.showMessage(
        'warn',
        'Tamanho do arquivo excede o limite de 700mb!',
        ''
      );
      this.selectFile = null;
      return false;
    }
    return true;
  }
}
