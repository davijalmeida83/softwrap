import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock, FiCalendar, FiUsers, FiBook, FiMap } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';
import { useToast } from '../../hooks/ToastContext';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, AnimationContainer, Background } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const FormRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        FormRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);
        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer o seu login no Softwrap!',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          FormRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'info',
          title: 'Erro ao realizar cadastro',
          description: 'Ocorreu um erro ao criar um novo cadastro, verifique!',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src="" alt="Softwrap" />
          <Form ref={FormRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="id_owner" icon={FiUser} placeholder="Owner" />
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="age" icon={FiCalendar} placeholder="Idade" />
            <Input name="maritalstatus" icon={FiUsers} placeholder="Estado Civil" />
            <Input name="cpf" icon={FiBook} placeholder="Cpf" />
            <Input name="city" icon={FiMap} placeholder="Cidade" />
            <Input name="state" icon={FiMap} placeholder="Estado" />
            <Input name="email" icon={FiMail} placeholder="Email" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Cadastrar</Button>
            <Link to="/">
            <FiArrowLeft />
            Voltar
          </Link>
          </Form>

        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
