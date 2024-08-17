import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Auth()
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async saveFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string,
  ) {
    return this.fileService.saveFiles(files, folder);
  }
}
