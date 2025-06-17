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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
@Controller('upload')
export class UploadController {
  @Post('image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '이미지 업로드',
    description: '이미지를 업로드합니다.',
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
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          console.log('🔧 Generated filename:', filename);
          callback(null, filename);
        },
      }),
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
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }
    console.log(file);
    // 이미지 URL 생성
    const imageUrl = `http://localhost:4000/uploads/${file.filename}`;

    return {
      success: true,
      imageUrl,
      originalName: file.originalname,
      size: file.size,
    };
  }
}
