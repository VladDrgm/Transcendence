import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { extname } from 'path';

@Injectable()
export class FileService {
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      await fs.unlink(imageUrl);
    } catch (error) {}
  }

  async saveAvatar(file: Express.Multer.File, id: number): Promise<string> {
    const avatarFolderPath = process.env.AVATAR_FOLDER_PATH;
    const originalFileName = file.originalname;
    const indexOfLastDot = originalFileName.lastIndexOf('.');
    const fileNameWithoutExtension = originalFileName.slice(0, indexOfLastDot);
    const modifiedFileName = fileNameWithoutExtension;
    const filePath = `${avatarFolderPath}/${modifiedFileName}${id}${extname(
      file.originalname,
    )}`;
    try {
      await fs.writeFile(filePath, file.buffer);
      return filePath;
    } catch (error) {
      throw new Error('Failed to save avatar.');
    }
  }
}
