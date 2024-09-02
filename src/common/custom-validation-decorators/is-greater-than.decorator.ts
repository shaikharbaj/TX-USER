import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
  } from 'class-validator';
  
  export function IsGreaterThan(
    property: string,
    validationOptions?: ValidationOptions,
  ) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [property],
        validator: IsGreaterThanConstraint,
      });
    };
  }
  
  @ValidatorConstraint({ name: 'IsGreaterThan' })
  class IsGreaterThanConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      const relatedValue = (args.object as any)[relatedPropertyName];
      return value > relatedValue;
    }
  
    defaultMessage(args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      return `${args.property} should be greater than ${relatedPropertyName}.`;
    }
  }
  