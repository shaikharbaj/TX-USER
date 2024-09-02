import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsNumericIndexedArray(property?: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsNumericIndexedArrayConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsNumericIndexedArray' })
export class IsNumericIndexedArrayConstraint implements ValidatorConstraintInterface {
  public validationErrorObj: any = {
    is_valid: true,
    type: '',
    message: '',
  };
  validate(value: any, args: ValidationArguments) {
    if(!value){
      return false;
    }
    const parsedArr = JSON.parse(value);
    if (!Array.isArray(parsedArr)) {
      return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return "Permission should be index array of integer.";
  }
}
