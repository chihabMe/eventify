import { Storage } from '@google-cloud/storage';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME!;
  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const filename = `${uuidv4()}-${file.originalname}`;
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: true,
        contentType: file.mimetype,
      });
      return new Promise<string>((resolve, reject) => {
        blobStream.on('error', (err) => reject(err));
        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;
          resolve(publicUrl);
        });
        blobStream.end(file.buffer);
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Failed to upload file. Please try again.',
      );
    }
  }
}
