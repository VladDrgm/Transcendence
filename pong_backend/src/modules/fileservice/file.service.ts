import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import path, { extname } from 'path';

@Injectable()
export class FileService {
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      await fs.unlink(imageUrl);
    } catch (error) {}
  }

  async saveAvatar(file: Express.Multer.File, id: number): Promise<string> {
    const avatarFolderPath = './avatars';
    const originalFileName = file.originalname;
    const indexOfLastDot = originalFileName.lastIndexOf('.');
    const fileNameWithoutExtension = originalFileName.slice(0, indexOfLastDot);
    const modifiedFileName = fileNameWithoutExtension;
    const filePath = `${avatarFolderPath}/${modifiedFileName}${id}${extname(
      file.originalname,
    )}`;
    console.log(filePath);
    try {
      await fs.writeFile(filePath, file.buffer);
      return filePath;
    } catch (error) {
      console.error('Failed to save avatar:', error);
      throw new Error('Failed to save avatar.');
    }
  }
}
