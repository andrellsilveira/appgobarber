import React, { useCallback, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationsError';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigation = useNavigation();
  /**
   * O "useRef" no React Native serve para que possamos controlar o comportamento
   * dos elementos sem que haja interação com algum evento, ou seja,
   * ter acesso de uma forma direta às suas propriedades e métodos
   */
  const formRef = useRef<FormHandles>(null);

  /** Cria uma referência para o campo "senha" para possibilitar sua manipulação */
  const passwordInputRef = useRef<TextInput>(null);

  /** Recupera o método de autenticação a partir do hook */
  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        /**
         * Limpa qualquer erro existente
         */
        formRef.current?.setErrors({});
        /**
         * Esquema criado para a validação dos dados do formulário,
         * onde indicamos para o Yup que os dados estão em formato de
         * objeto (object) o quel tem um formato definido pelo método
         * "shape"
         */
        const schema = Yup.object().shape({
          /**
           * Indica para o Yup que o campo "name" é do tipo "string" e
           * é obrigatório (required)
           */
          email: Yup.string()
            .required('Informe seu e-mail')
            .email('Informe um e-mail válido!'),
          password: Yup.string().required('Informe sua senha'),
        });

        /**
         * Executa a validação dos dados com base nas configurações
         * definidas para o esquema
         * A propriedade "abortEarly" tem como padrão o valor "true"
         * fazendo com que a validação retorne e pare no primeiro erro
         * encontrado, alterando seu valor para "false", todos os erros
         * serão retornados de um vez
         */
        await schema.validate(data, {
          abortEarly: false,
        });

        /**
         * Executa o método que está definido dentro do contexto
         * de autenticação
         */
        await signIn({
          email: data.email,
          password: data.password,
        });

        /**
         * Redireciona para o dashboard
         */
        navigation.navigate('Dashboard');
      } catch (err) {
        /**
         * Verifica se o erro é otiginado a partir de um validação
         * da biblioteca Yup
         */
        if (err instanceof Yup.ValidationError) {
          /**
           * Recupera e formata os erros
           */
          const errors = getValidationErrors(err);
          /**
           * Define os erros para o formulário
           */
          formRef.current?.setErrors(errors);
        }

        /**
         * Dispara um alerta na aplicação
         */
        Alert.alert(
          'Falha na autenticação!',
          'Verifique os dados preenchidos.',
        );
      }
    },
    [signIn, navigation],
  );

  return (
    <>
      {/**
       * O componente "KeyboardAvoidingView" evita que o teclado sobreponha os elementos
       * da tela ao ativá-lo para inserir um texto
       * A propriedade "behavior" indica qual o comportamento do container ao evitar o
       * teclado, nesse caso está sendo definido de acordo com a plataforma
       */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/**
         * A propriedade "keyboardShouldPersistTaps" define o comportamento do teclado
         * quando o usuário toca na tela para fazer o scroll, no caso o valor "handled"
         * especifica que deve agir conforme o padrão da plataforma
         */}
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />

            {/**
             * Ao realizar a movimentação dos componentes quando o teclado é ativado
             * o texto não é animado da mesma forma que os demais, causando uma quebra
             * no visual, a "View" por volta, faz com que ela receba a animação evitando
             * o problema
             */}
            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                /** Define se deverá ser realizada a correção automática para o texto do elemento */
                autoCorrect={false}
                /** Define como deverá ser executada a capitalização do texto do elemento */
                autoCapitalize="none"
                /** Deine o tipo do teclado a ser exibido para o elemento */
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                /** Define o texto que será exibido para o botão "Enter" do teclado */
                returnKeyType="next"
                /** Função disparada quando o usuário clica no botão "Enter" */
                onSubmitEditing={() => {
                  /** Define o foco no campo "senha" */
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                /** Define um campo do tipo senha */
                secureTextEntry
                /** Define o texto que será exibido para o botão "Enter" do teclado */
                returnKeyType="send"
                /** Função disparada quando o usuário clica no botão "Enter" */
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPassword
              onPress={() => {
                console.log('foi');
              }}
            >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
