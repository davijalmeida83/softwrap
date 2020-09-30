import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
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

    const response = await authenticateUser.execute({
      email: 'davij_almeida@hotmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'davij_almeida@hotmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await await fakeUsersRepository.create({
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
      authenticateUser.execute({
        email: 'davij_almeida@hotmail.com',
        password: 'wron-password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
