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

import api from '../../services/api';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  /**
   * O "useRef" no React Native serve para que possamos controlar o comportamento
   * dos elementos sem que haja interação com algum evento
   */
  const formRef = useRef<FormHandles>(null);

  /** Cria referências para os campos para possibilitar sua manipulação */
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
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
          name: Yup.string().required('O nome é obrigatório!'),
          email: Yup.string()
            .required('O e-mail é obrigatório')
            .email('Informe um e-mail válido!'),
          password: Yup.string().min(
            6,
            'A senha deve ter no mínimo 6 caracteres',
          ),
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
         * Executa a API passando os dados para a criação do usuário
         */
        await api.post('/users', data);

        /**
         * Exibe um alerta de sucesso
         */
        Alert.alert(
          'Cadastrado realizado com sucesso!',
          'Você já pode realizar o seu logon no GoBarber!',
        );

        navigation.goBack();
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

          return;
        }

        /**
         * Dispara um alerta na aplicação
         */
        Alert.alert(
          'Falha no cadastro!',
          'Verifique os dados preenchidos e tente novamente.',
        );
      }
    },
    [navigation],
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
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                /** Define como deverá ser executada a capitalização do texto do elemento */
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                /** Define o texto que será exibido para o botão "Enter" do teclado */
                returnKeyType="next"
                /** Função disparada quando o usuário clica no botão "Enter" */
                onSubmitEditing={() => {
                  /** Define o foco no campo "e-maIL" */
                  emailInputRef.current?.focus();
                }}
              />

              <Input
                ref={emailInputRef}
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
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#f4ede8" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
