import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => (
  /**
   * O componente "NavigationContainer" é um provider de contexto
   * para a utilização da navegação fornecida pela "react-navigation",
   * devendo todas as rotas estarem encapsuladas dentro dele
   */

  <NavigationContainer>
    {/** A propriedade "barStyle" e o tema da barra de status */}
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <AppProvider>
      {/** A propriedade "style" é equivalente àquela do HTML */}
      <View style={{ flex: 1, backgroundColor: '#312e38' }}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

export default App;
