import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  mergeMap,
  of,
  tap,
  throwError,
} from 'rxjs';

@Component({
  selector: 'nat-upload-file',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.less',
})
export class UploadFileComponent {
  private http = inject(HttpClient);
  files: File[] | null = null;
  uploadProgress = 0;
  uploadErrors: string[] = [];

  uploadURL: string = 'https://file.io/';

  change(event: Event) {
    this.files = (event.target as HTMLInputElement).files as File[] | null;
  }

  upload() {
    if (!this.files || this.files.length === 0) {
      return;
    }
    this.uploadProgress = 0;
    this.uploadErrors = [];

    this.uploadFilesInBatches(this.files);
  }

  uploadFilesInBatches(files: File[]) {
    const batch = Array.from(files).slice(0, 2); // Get the first 5 files
    const remainingFiles = Array.from(files).slice(2); // Remaining files for next batch

    this.uploadBatch(batch).subscribe({
      next: () => {
        if (remainingFiles.length > 0) {
          this.uploadFilesInBatches(remainingFiles); // Recursive call
        } else {
          console.log('All files uploaded successfully!');
          this.uploadProgress = 100;
        }
      },
      error: (error) => {
        this.uploadErrors.push(error.message); // Handle errors
      },
    });
  }

  uploadBatch(batch: File[]): Observable<any> {
    const uploadObservables = [];
    for (const file of batch) {
      uploadObservables.push(this.uploadFile(file));
    }

    return forkJoin(uploadObservables).pipe(
      tap(() => {
        // Update overall progress after each batch
        const uploadedFiles = this.files ? this.files.length - batch.length : 0;
        this.uploadProgress = Math.floor(
          (uploadedFiles / this.files!.length) * 100
        );
      })
    );
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Replace with your actual API endpoint and request configuration
    return this.http
      .post(this.uploadURL, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((error) => {
          return throwError(
            () =>
              new Error(`Error uploading file ${file.name}: ${error.message}`)
          );
        }),
        tap((event) => {
          if (event && event.type === HttpEventType.UploadProgress) {
            // Calculate progress for the current file
            const fileProgress = Math.round(
              (event.loaded / (event.total || 1)) * 100
            );
            console.log(`Uploading ${file.name}: ${fileProgress}%`); // Optional for logging
          }
        }),
        map((event) => {
          if (event instanceof HttpResponse) {
            return event.body; // Handle successful response
          }
          return null;
        })
      );
  }
}
