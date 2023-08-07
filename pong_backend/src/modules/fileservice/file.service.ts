import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { extname } from 'path';

@Injectable()
export class FileService {
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Log the imageUrl for debugging
      console.log('Deleting image:', imageUrl);
      await fs.unlink(imageUrl);
    } catch (error) {
      console.error(`Error deleting image: ${imageUrl}`);
    }
  }

  async saveAvatar(file: Express.Multer.File, id: number): Promise<string> {
    const avatarFolder = './avatars';
    const filePath = `${avatarFolder}/${id}${extname(file.originalname)}`;

    try {
      await fs.writeFile(filePath, file.buffer);
      return filePath;
    } catch (error) {
      console.error(`Error saving avatar: ${error.message}`);
      throw new Error('Failed to save avatar.');
    }
  }
}
