import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationsError';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const navigation = useNavigation();
  /**
   * O "useRef" no React Native serve para que possamos controlar o comportamento
   * dos elementos sem que haja interação com algum evento
   */
  const formRef = useRef<FormHandles>(null);

  /** Cria referências para os campos para possibilitar sua manipulação */
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
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
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => !!val.length,
            then: Yup.string().min(
              6,
              'A senha deve ter no mínimo 6 caracteres',
            ),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string()
            .when('password', {
              is: val => !!val.length,
              then: Yup.string().required('Confirme a nova senha'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
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

        const formData = {
          name: data.name,
          email: data.email,
          /**
           * Spread operator (...): Adiona as demais informações ao objeto somente se a
           * senha atual estiver preenchida
           */
          ...(data.oldPassword
            ? {
                oldPassword: data.oldPassword,
                password: data.password,
                passwordConfirmation: data.passwordConfirmation,
              }
            : {}),
        };

        /**
         * Executa a API passando os dados para a criação do usuário
         */
        const response = await api.put('/profile', formData);

        /**
         * Atualiza os dados do usuário na sessão
         */
        updateUser(response.data);

        /**
         * Exibe um alerta de sucesso
         */
        Alert.alert('Perfil atualizado com sucesso!');

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
          'Falha na atualização do perfil!',
          'Verifique os dados preenchidos e tente novamente.',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'User câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao atualizar seu avatar.', response.error);
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api.patch('users/avatar', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });
      },
    );
  }, [updateUser, user.id]);

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
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatarURL }} />
            </UserAvatarButton>

            {/**
             * Ao realizar a movimentação dos componentes quando o teclado é ativado
             * o texto não é animado da mesma forma que os demais, causando uma quebra
             * no visual, a "View" por volta, faz com que ela receba a animação evitando
             * o problema
             */}
            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp} initialData={user}>
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
                  oldPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={oldPasswordInputRef}
                name="oldPassword"
                icon="lock"
                placeholder="Senha atual"
                containerStyle={{ marginTop: 16 }}
                /** Define um campo do tipo senha */
                secureTextEntry
                /** Define o texto que será exibido para o botão "Enter" do teclado */
                returnKeyType="next"
                /** Função disparada quando o usuário clica no botão "Enter" */
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Nova senha"
                /** Define um campo do tipo senha */
                secureTextEntry
                /** Define o texto que será exibido para o botão "Enter" do teclado */
                returnKeyType="next"
                /** Função disparada quando o usuário clica no botão "Enter" */
                onSubmitEditing={() => {
                  passwordConfirmationInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordConfirmationInputRef}
                name="passwordConfirmation"
                icon="lock"
                placeholder="Confirmar senha"
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
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
