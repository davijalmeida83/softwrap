import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';

let fakeUsersRepository: FakeUsersRepository;
let ListUsers: ListUsersService;

describe('ListUsersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    ListUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list users', async () => {
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

    const listUsers = await ListUsers.execute({
      id_owner: '0',
    });

    if (listUsers.length > 0) {
      expect(listUsers[0].name).toBe('DAVI ALMEIDA');
      expect(listUsers[0].email).toBe('davij_almeida@hotmail.com');
    }

  });

  it('should be able show the profile from non-existing user', async () => {
    await expect(
      ListUsers.execute({
        id_owner: 'non-existing-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
