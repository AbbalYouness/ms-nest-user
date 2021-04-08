import { Controller, HttpStatus, Inject, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { IUser } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { IUserCreateResponse } from './interfaces/user-create-response.interface';
import { IUserCredentials } from './interfaces/user-credentials.interface';
import { IUserFindResponse } from './interfaces/user-find-response.interface';

@Controller()
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @MessagePattern('create_user')
  public async createUser(userParams: IUser): Promise<IUserCreateResponse> {
    let result: IUserCreateResponse;

    try {
      const createdUser = await this.userService.createUser(userParams);

      result = {
        status: HttpStatus.CREATED,
        message: 'create_user_success',
        user: createdUser,
        errors: null,
      };
      Logger.log('create_user_success');
    } catch (e) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'create_user_bad_request',
        user: null,
        errors: e,
      };
      Logger.error('create_user_bad_request', e);
    }

    return result;
  }

  @MessagePattern('find_user_by_credentials')
  public async findUserByCredentials({
    email,
    password,
  }: IUserCredentials): Promise<IUserFindResponse> {
    let result;
    const user = await this.userService.findByEmail(email);

    if (user) {
      if (await user.isValidPassword(password)) {
        result = {
          status: HttpStatus.OK,
          message: 'find_user_by_credentials_success',
          user: user,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'find_user_by_credentials_not_found',
          user: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.NOT_FOUND,
        message: 'find_user_by_credentials_not_found',
        user: null,
      };
    }

    return result;
  }
}
