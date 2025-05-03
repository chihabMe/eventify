import { PipeTransform, Injectable } from '@nestjs/common';
import { CustomBadRequestException } from '../exceptions/custom-badrequest.exception';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedTypes: string[];

  constructor(allowedTypes: string[]) {
    this.allowedTypes = allowedTypes;
  }

  transform(value: any) {
    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new CustomBadRequestException({
        message: 'File size exceeds the maximum limit',
        errors: [
          {
            field: 'file',
            message: `Invalid file type. Allowed types are: ${this.allowedTypes.join(', ')}`,
          },
        ],
      });
    }
    return value;
  }
}
