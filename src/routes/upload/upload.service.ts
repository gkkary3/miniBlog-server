import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // 환경변수 검증
    const awsRegion = this.configService.get<string>('AWS_REGION');
    const awsAccessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const awsBucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (
      !awsRegion ||
      !awsAccessKeyId ||
      !awsSecretAccessKey ||
      !awsBucketName
    ) {
      throw new Error(
        'AWS S3 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.',
      );
    }

    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    this.bucketName = awsBucketName;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // 퍼블릭 읽기 권한
    });

    try {
      await this.s3Client.send(command);

      // S3 URL 생성
      const awsRegion = this.configService.get<string>('AWS_REGION');
      const imageUrl = `https://${this.bucketName}.s3.${awsRegion}.amazonaws.com/${fileName}`;

      return imageUrl;
    } catch (error) {
      console.error('S3 업로드 에러:', error);
      throw new Error('파일 업로드에 실패했습니다.');
    }
  }
}
