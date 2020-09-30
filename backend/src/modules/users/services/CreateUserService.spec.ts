import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;


let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();


    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider

    );
  });

  it('should be able to create a new user', async () => {
    const User = await createUser.execute({
      id_owner: '0',
      name: 'DAVI ALMEIDA',
      age: '36',
      maritalstatus: 'SOLTEIRO',
      cpf: '12345678951',
      city: 'MACEIÓ',
      state: 'ALAGOAS',
      email: 'davij_almeida@hotmail.com',
      password: '123456',
    });

    expect(User).toHaveProperty('id');
  });

  it('should be able to create a new user with the same email from another', async () => {
    await createUser.execute({
      id_owner: '0',
      name: 'DAVI ALMEIDA',
      age: '36',
      maritalstatus: 'SOLTEIRO',
      cpf: '12345678951',
      city: 'MACEIÓ',
      state: 'ALAGOAS',
      email: 'davij_almeida@hotmail.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        id_owner: '0',
        name: 'DAVI ALMEIDA',
        age: '36',
        maritalstatus: 'SOLTEIRO',
        cpf: '12345678951',
        city: 'MACEIÓ',
        state: 'ALAGOAS',
        email: 'davij_almeida@hotmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
