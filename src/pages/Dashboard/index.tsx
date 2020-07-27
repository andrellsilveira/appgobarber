import React from 'react';
import { Button } from 'react-native';

import { useAuth } from '../../hooks/auth';

import { Container, Title } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <Title>Dashboard</Title>
      <Button title="Sair" onPress={signOut} />
    </Container>
  );
};

export default Dashboard;
