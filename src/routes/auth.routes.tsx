import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

/**
 * Cria um novo navigator para definição e gerenciamento das rotas
 * da aplicação
 */
const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  /**
   * O componente "Auth.Navigator" é responsável por gerenciar as
   * rotas definidas para a aplicação
   * A propriedade "screenOptions" define algumas opções para as
   * rotas da aplicação:
   * - headerShown: Define se o cabeçalho deve ou não ser exibido
   * - cardStyle: Define estilos para a rota
   */
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: '#312e38',
      },
    }}
    /**
     * Indica qual é a rota de início da aplicação
     */
    initialRouteName="SignIn"
  >
    {/**
     * O componente "Auth.Screen" é reponsável pela definição
     * de uma rota
     */}
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
);

export default AuthRoutes;
