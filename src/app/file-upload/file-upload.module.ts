import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  exports: [
    FileUploadComponent,
  ]
})
export class FileUploadModule { }
