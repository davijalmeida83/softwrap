import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_owner, name, age, maritalstatus, cpf, city, state, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      id_owner,
      name,
      age,
      maritalstatus,
      cpf,
      city,
      state,
      email,
      password,
    });

    return response.json(classToClass(user));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const id_owner = request.user.id;

    const listUsers = container.resolve(ListUsersService);

    const user = await listUsers.execute({ id_owner });

    return response.json(classToClass(user));
  }
}
