import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update profile', async () => {
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

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      id_owner: '0',
      name: 'Davi José de Almeida',
      age: '36',
      maritalstatus: 'SOLTEIRO',
      cpf: '12345678951',
      city: 'MACEIÓ',
      state: 'ALAGOAS',
      email: 'almeida@hotmail.com',

    });

    expect(updateUser.name).toBe('Davi José de Almeida');
    expect(updateUser.email).toBe('almeida@hotmail.com');
  });

  it('should be able update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        id_owner: '0',
        name: 'teste',
        age: '36',
        maritalstatus: 'SOLTEIRO',
        cpf: '12345678951',
        city: 'MACEIÓ',
        state: 'ALAGOAS',
        email: 'teste@hotmail.com',
        password: '123456'

      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
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

    const user = await fakeUsersRepository.create({
      id_owner: '0',
      name: 'Teste',
      age: '36',
      maritalstatus: 'SOLTEIRO',
      cpf: '12345678951',
      city: 'MACEIÓ',
      state: 'ALAGOAS',
      email: 'teste@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
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

  it('should be able to update the password', async () => {
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

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      id_owner: '0',
      name: 'DAVI ALMEIDA',
      age: '36',
      maritalstatus: 'SOLTEIRO',
      cpf: '12345678951',
      city: 'MACEIÓ',
      state: 'ALAGOAS',
      email: 'davij_almeida@hotmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updateUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
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

    await expect(
      updateProfile.execute({
        user_id: user.id,
        id_owner: '0',
        name: 'DAVI ALMEIDA',
        age: '36',
        maritalstatus: 'SOLTEIRO',
        cpf: '12345678951',
        city: 'MACEIÓ',
        state: 'ALAGOAS',
        email: 'davij_almeida@hotmail.com',
        // old_password: '123123',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
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

    await expect(
      updateProfile.execute({
        user_id: user.id,
        id_owner: '0',
        name: 'DAVI ALMEIDA',
        age: '36',
        maritalstatus: 'SOLTEIRO',
        cpf: '12345678951',
        city: 'MACEIÓ',
        state: 'ALAGOAS',
        email: 'davij_almeida@hotmail.com',
        old_password: 'wrong_old_password',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
