import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MessagesModule,
    MessageModule,
  ],
  exports: [
    FileUploadComponent,
  ],
  providers: [MessageService],
})
export class FileUploadModule {
 }
