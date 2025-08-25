import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import { describe, beforeEach } from 'node:test';

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent]
    });
    fixture = TestBed.createComponent(FileUploadComponent);
    fixture.detectChanges();
  });
});
