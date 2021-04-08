import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getRepository } from 'typeorm';

import { User } from '../entities/user.entity';

@ValidatorConstraint({ async: true })
class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public validate(email: string, args: ValidationArguments) {
    return getRepository(User)
      .findOne({ where: { email } })
      .then((user) => {
        if (user) {
          return false;
        }
        return true;
      });
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
