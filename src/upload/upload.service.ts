import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECURET_ACCESS_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'aws-s3-nestjs',
        Key: fileName,
        Body: file,
      }),
    );
  }
  async download(fileName: string) {
    const command = new GetObjectCommand({
      Bucket: 'aws-s3-nestjs',
      Key: fileName,
    });
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
  }
  async delete(fileName: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'aws-s3-nestjs',
        Key: fileName,
      }),
    );
  }
}
