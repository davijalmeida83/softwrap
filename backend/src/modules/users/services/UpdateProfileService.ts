import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  id_owner: string;
  name: string;
  age: string;
  maritalstatus: string;
  cpf: string;
  city: string;
  state: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider

  ) {}

  public async execute({
    user_id,
    id_owner,
    name,
    age,
    maritalstatus,
    cpf,
    city,
    state,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found!');
    }

    const userWithUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError('Email already in use !');
    }

    user.id_owner = id_owner;
    user.name = name;
    user.age = age;
    user.maritalstatus = maritalstatus;
    user.cpf = cpf;
    user.city = city;
    user.state = state;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform olde password to set a new password !'
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      if (!checkOldPassword) {
        throw new AppError('Old password this not match!');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
