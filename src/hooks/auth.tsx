import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatarURL: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

/**
 * Realiza a criação do contexto com o modelo da interface
 * ! Para evitar que acuse erro ao inicializar o contexto com um
 * objeto vazio {}, deve-se forçar a tipagem do mesmo (as Interface)
 */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
 * Componente principal do contexto de autenticação
 * Esse componente deverá encapsular todos os componentes da aplicação
 * que estarão inseridos num contexto de autenticação, ou seja, todo
 * componente que necessitar de verificação quanto a autenticação do
 * usuário deverá estar aninhado dentro do componente AuthProvider
 */
const AuthProvider: React.FC = ({ children }) => {
  /**
   * Armazena todos os dados do login em um estado para possibilitar
   * a utilização dessas informações por outros componentes da
   * aplicação através do contexto
   */
  const [data, setData] = useState<AuthState>({} as AuthState);
  /**
   * Cria um estado de carregamento do componente e inicializa-o
   * como true
   */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Ao carregar o componente, verifica se já existem as informações
     * de autenticação e, em caso positivo, as recupera para a
     * inicialização do estado, caso contrário força o retorno como
     * um objeto vazio
     */
    async function loadStorageData(): Promise<void> {
      /**
       * Recupera as informações do storage
       */
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      /** Se existirem as informações, então as define para o estado */
      if (token[1] && user[1]) {
        /**
         * Define o token como valor padrão para a autenticação das rotas da API
         */
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      /**
       * Define o carregamento do componente como false
       */
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });

    const { token, user } = response.data;

    /**
     * Ao armazenar no "AsyncStorage", sempre identificar a aplicação
     * junto ao nome do item, precedida com @ para facilitar a identificação
     * caso seja necessário consultar o armazenamento dos itens do sistema
     * Valores não comuns como string, number e boolean precisam ser
     * convertidos para JSON
     */
    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    /**
     * Define o token como valor padrão para a autenticação das rotas da API
     */
    api.defaults.headers.authorization = `Bearer ${token}`;

    /**
     * Atualiza as informações de estado após realizar o login
     */
    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    /**
     * Remove os itens do "AsyncStorage"
     */
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    /**
     * Define o estado de "data" como um objeto vazio
     */
    setData({} as AuthState);
  }, []);

  /**
   * A propriedade "Partial" (Partial<User>) indica que os atributos de determinada
   * classe/interface podem ou não ser passados para a função, ou seja, torna todos
   * os atributos opcionais
   */
  const updateUser = useCallback(
    async (user: User) => {
      setData({
        token: data.token,
        user,
      });

      /**
       * Valores não comuns como string, number e boolean precisam ser
       * convertidos para JSON
       */
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
    },
    [setData, data.token],
  );

  return (
    /**
     * A propriedade "Provider" do contexto, identifica que todos
     * os componentes que estiverem aninhados dentro das tags
     * terão acesso às propriedades e valores daquele contexto
     * As propriedades e métodos que poderão ser acessadas pelos
     * demais componentes da aplicação deverão estar especificados
     * no atributo "value" do Provider
     */
    <AuthContext.Provider
      value={{ user: data.user, loading, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para utilização do contexto de autenticação nos demais
 * componentes da aplicação.
 * Esse hook serve para simplificar o acesso às informações de
 * autenticação pelos demais componentes do sistema
 */
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  /**
   * Verifica se o contexto foi criado, caso não tenha sido, então
   * dispara um erro, pois a falta do componente AuthProvider causa
   * a falha da inicialização do contexto
   */
  if (!context) {
    throw new Error('useAuth deve ser utilizado com um AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
