import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/routes/auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

// Multer 파일 타입 정의
interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '이미지 업로드',
    description: '이미지를 AWS S3에 업로드합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 이미지 파일',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '이미지 업로드 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        imageUrl: { type: 'string' },
        originalName: { type: 'string' },
        size: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '파일이 업로드되지 않았거나 잘못된 파일 형식',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, callback) => {
        console.log('🔍 File filter - mimetype:', file.mimetype);
        console.log('🔍 File filter - originalname:', file.originalname);

        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];

        const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;

        if (
          !allowedMimeTypes.includes(file.mimetype) ||
          !file.originalname.match(allowedExtensions)
        ) {
          console.log('❌ File rejected - not an image');
          return callback(
            new Error(
              `이미지 파일만 업로드 가능합니다! (허용 형식: jpg, jpeg, png, gif, webp)`,
            ),
            false,
          );
        }

        console.log('✅ File accepted');
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 제한
      },
    }),
  )
  async uploadImage(@UploadedFile() file: UploadFile) {
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }

    console.log('📤 파일 업로드 시작:', file.originalname);

    try {
      // S3에 파일 업로드
      const imageUrl = await this.uploadService.uploadFile(file);

      console.log('✅ S3 업로드 완료:', imageUrl);

      return {
        success: true,
        imageUrl,
        originalName: file.originalname,
        size: file.size,
      };
    } catch (error) {
      console.error('❌ 업로드 실패:', error);
      throw new BadRequestException('파일 업로드에 실패했습니다.');
    }
  }
}
