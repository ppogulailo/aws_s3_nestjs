import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AWS_S3_REGION: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
