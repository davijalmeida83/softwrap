import { renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { act } from 'react-dom/test-utils';
import { useAuth, AuthProvider } from '../../hooks/AuthContext';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hooks', () => {
  it('Should be able signin', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'User test',
        email: 'emailteste@example.com',
      },
      token: 'token123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem'); // usada a classe pois o 'localStorage' e 'SessionStorage' são alias de um objeto instanciado

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'emailteste@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Sofwrap:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@Sofwrap:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toEqual('emailteste@example.com');
  });

  it('Should restore saved data from  storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@Sofwrap:token':
          return 'token123';
        case '@Sofwrap:user':
          return JSON.stringify({
            id: 'user123',
            name: 'User test',
            email: 'emailteste@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('emailteste@example.com');
  });

  it('Should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@Sofwrap:token':
          return 'token123';
        case '@Sofwrap:user':
          return JSON.stringify({
            id: 'user123',
            name: 'User test',
            email: 'emailteste@example.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.singOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined;
  });

  it('Should be able to update  user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user123',
      name: 'User test',
      email: 'emailteste@example.com',
      avatar_url: 'image-test.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Sofwrap:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
