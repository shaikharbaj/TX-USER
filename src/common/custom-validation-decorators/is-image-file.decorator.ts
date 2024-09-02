import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsImage(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    let failuerType = '';
    registerDecorator({
      name: 'IsImage',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(file: any, args: ValidationArguments) {
          failuerType = '';
          if (!file || !file.buffer) {
            failuerType = 'NOT_A_FILE';
            return false;
          }
          if (!file.mimetype.startsWith('image/')) {
            failuerType = 'INVALID_FILE';
            return false;
          }
          const maxSizeBytes = 3 * 1024 * 1024; // 10MB
          const buffer = file.buffer;
          if (buffer.data.length > maxSizeBytes) {
            failuerType = 'FILE_SIZE_EXCEED';
            return false;
          }
          return true;
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          switch (failuerType) {
            case 'NOT_A_FILE':
              return 'Please upload a valid file';
            case 'INVALID_FILE':
              return 'File must be an image file (jpeg, jpg, png).';
            case 'FILE_SIZE_EXCEED':
              return 'File size exceeds the maximum allowed size.';
            default:
              return 'Invalid file.';
          }
        },
      },
    });
  };
}
