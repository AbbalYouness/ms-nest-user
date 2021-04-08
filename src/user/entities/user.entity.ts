import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hash, compareSync } from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail, Length, MaxLength, IsOptional } from 'class-validator';

import { IsEmailAlreadyExist } from '../decorators/IsEmailAlreadyExist';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsEmail()
  @MaxLength(100)
  @IsEmailAlreadyExist({ message: 'Email already exists' })
  @Column({ type: 'varchar', length: 100, unique: true })
  public email: string;

  @IsOptional()
  @MaxLength(50)
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  public username: string;

  @Length(5, 64)
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 64 })
  public password: string;

  @Column({ default: true })
  public isActive: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  public isValidPassword(password: string) {
    return compareSync(password, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }
}
