import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Multer 파일 타입 정의
interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class UploadService {
  private s3Client: S3Client | null = null;
  private bucketName: string;
  private isConfigured: boolean = false;

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
      console.warn(
        '⚠️ AWS S3 환경변수가 설정되지 않았습니다. 업로드 기능이 비활성화됩니다.',
      );
      console.warn(
        '필요한 환경변수: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME',
      );
      this.isConfigured = false;
      return;
    }

    try {
      this.s3Client = new S3Client({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      });

      this.bucketName = awsBucketName;
      this.isConfigured = true;
      console.log('✅ AWS S3 설정 완료');
    } catch (error) {
      console.error('❌ AWS S3 설정 실패:', error);
      this.isConfigured = false;
    }
  }

  async uploadFile(file: UploadFile): Promise<string> {
    if (!this.isConfigured || !this.s3Client) {
      throw new Error('AWS S3가 설정되지 않았습니다. 환경변수를 확인하세요.');
    }

    const fileName = `${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL 설정 제거 (버킷 정책으로 퍼블릭 읽기 권한 설정)
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
