import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  /**
   * Exibe feedback para o usuário enquanto a aplicação
   * estiver carregando
   */
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff9000" />
      </View>
    );
  }

  /**
   * Verifica se o usuário já está autenticado ou não e então redireciona-o
   * para as rotas de acrodo com seu estado:
   * AuthRouts: Usuário não autenticado
   * AppRouths: Usuário autenticado
   */
  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
