import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FileService {
  async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
    const uploadedFolder = `${path}/uploads/${folder}`;

    await ensureDir(uploadedFolder);

    const response = await Promise.all(
      files.map(async (file) => {
        const originalname = `${Date.now()}-${file.originalname}`;

        await writeFile(`${uploadedFolder}/${originalname}`, file.buffer);

        return {
          url: `/uploads/${folder}/${originalname}`,
          name: file.originalname,
        };
      }),
    );

    return response;
  }
}
