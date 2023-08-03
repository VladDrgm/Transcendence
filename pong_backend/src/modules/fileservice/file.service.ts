import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class FileService {
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      await fs.unlink(imageUrl);
    } catch (error) {
      console.error(`Error deleting image: ${error.message}`);
    }
  }

  async saveAvatar(file: Express.Multer.File, id: number): Promise<string> {
    const avatarFolder = './avatars';
    const filePath = `${avatarFolder}/${id}.png`;
    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }
}
