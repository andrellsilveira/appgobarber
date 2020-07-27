import React from 'react';

import { AuthProvider } from './auth';

/**
 * Este componente isola os hooks e contextos que aninham os demais
 * componentes da aplicação como o hook de autenticação
 * @param children: Componentes e elementos HTML que são passados
 * para dentro do componente
 */
const AppProvider: React.FC = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
