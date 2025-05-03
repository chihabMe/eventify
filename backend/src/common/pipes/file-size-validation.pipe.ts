import { PipeTransform, Injectable } from '@nestjs/common';
import { CustomBadRequestException } from '../exceptions/custom-badrequest.exception';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSize: number;

  constructor(maxSize = 5 * 1024 * 1024) {
    this.maxSize = maxSize;
  }

  transform(value: any) {
    if (value.size > this.maxSize) {
      throw new CustomBadRequestException({
        message: 'File size exceeds the maximum limit',
        errors: [
          {
            field: 'file',
            message: `File size exceeds ${this.maxSize / (1024 * 1024)} MB`,
          },
        ],
      });
    }
    return value;
  }
}
