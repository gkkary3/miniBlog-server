import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
@ApiTags('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API 서버 홈페이지',
    description: 'MiniBlog API 서버의 소개 페이지와 사용법을 제공합니다.',
  })
  getHello(@Res() res: Response): void {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(this.appService.getHello());
  }
}
