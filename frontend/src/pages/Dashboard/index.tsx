import React, {  useEffect  } from 'react';
import { FiPower, FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Section
} from './styles';

import { useAuth } from '../../hooks/AuthContext';

const Dashboard: React.FC = () => {

  const { singOut, user } = useAuth();

  useEffect(() => {

  }, []);


  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src="" alt="Softwrap" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo</span>
              <Link to="#">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <Link to="/newuser">
            <FiLogIn />
            Cadastrar
          </Link>
          <button type="button" onClick={singOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>

          <h1>Lista dos cadastrados</h1>

          <Section>

          </Section>




      </Content>
    </Container>
  );
};

export default Dashboard;
