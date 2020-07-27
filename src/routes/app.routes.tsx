import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';

/**
 * Cria um novo navigator para definição e gerenciamento das rotas
 * da aplicação
 */
const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  /**
   * O componente "App.Navigator" é responsável por gerenciar as
   * rotas definidas para a aplicação
   * A propriedade "screenOptions" define algumas opções para as
   * rotas da aplicação:
   * - headerShown: Define se o cabeçalho deve ou não ser exibido
   * - cardStyle: Define estilos para a rota
   */
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: '#312e38',
      },
    }}
  >
    {/**
     * O componente "App.Screen" é reponsável pela definição
     * de uma rota
     */}
    <App.Screen name="Dashboard" component={Dashboard} />
  </App.Navigator>
);

export default AppRoutes;
