import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
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

    await sendForgotPasswordEmail.execute({
      email: 'davij_almeida@hotmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to recover an non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'davij_almeida@hotmail.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
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

    await sendForgotPasswordEmail.execute({
      email: 'davij_almeida@hotmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
