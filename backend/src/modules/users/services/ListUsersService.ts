import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id_owner: string;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ id_owner }: IRequest): Promise<User[]> {
    let users = await this.usersRepository.findAllUsers(id_owner);

    if (users.length === 0) {
      throw new AppError('User not found!');
    }

    return users;
  }
}
export default ListUsersService;
