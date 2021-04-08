import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  public async createUser(user: IUser): Promise<IUser> {
    const newUser = this.userRepository.create(user);

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw errors;
    } else {
      return this.userRepository.save(newUser);
    }
  }

  public findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }
}
