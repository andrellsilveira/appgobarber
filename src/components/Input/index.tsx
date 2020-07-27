import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

/**
 * Interface criada para acessar as propriedades da referência,
 * nesse caso será necessário somente o acesso ao método "focus"
 */
interface InputRef {
  focus(): void;
}

/**
 * A propriedade "ref" é a única propriedade de um elemento que não
 * pode ser acessada diretamente como as demais, ela deve ser recebida
 * como segundo argumento da função e não é acessível através da
 * FC (Function Component) do React, devendo ser utilizada a função
 * RefForwardingComponent que recebe dois parâmetros:
 * 1. Tipo da referência
 * 2. Tipo do componente
 */
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...rest },
  ref,
) => {
  /**
   * Cria uma referência para o elemento para possibilitar o acesso de
   * uma forma direta de suas propriedades e métodos
   * Essa referência é necessária para que seja possível atualizar
   * visualmente o valor do componente através da biblioteca "unform"
   */
  const inputElementRef = useRef<any>(null);

  /**
   * Inicializa as variáveis que serão utilizadas para registrar o
   * campo do formulário
   * Define o valor inicial da propriedade "defaultValue" como vazio
   * para utilizá-la no valor de referência, logo em seguida
   */
  const { registerField, defaultValue = '', fieldName, error } = useField(name);

  /**
   * Gera a referência para possibilitar a recuperação do valor
   * do elemento definindo seu valor inicial como uma string vazia
   * Colocar essa definição logo após o registro do elemento "useField"
   * para poder definir o valor inicial com a propriedade "defaultValue"
   */
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  /**
   * Utiliza-se o "useEffect" para registrar o campo quando o
   * componente for criado
   */
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      /**
       * Define o valor do elemento
       * @param ref Referência do elemento
       * @param value Valor que está sendo passado para o input
       */
      setValue(ref: any, value: string) {
        /** Define o valor de referência */
        inputValueRef.current.value = value;
        /** Define o valor do elemento (atualiza visualmente) */
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        /** Limpa o valor de referência */
        inputValueRef.current.value = '';
        /** Limpa o valor do elemento (atualiza visualmente) */
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  /**
   * O hook "useImperativeHandle" serve para que possamos acessar
   * uma propriedade do elemento filho através do elemento pai e é
   * utilizada em casos bem específicos como esse, onde temos duas
   * referências para o mesmo elemento
   * Aqui o hook está sendo utilizado para que o evento focus seja
   * acessado
   */
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  return (
    <Container isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />

      <TextInput
        ref={inputElementRef}
        /**
         * A propriedade "keyboardAppearance" define a aparência do
         * teclado para dispositivos IOS
         */
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={
          /**
           * Recupera o valor definido para o input e o atribui
           * para a variável de referência a cada alteração no
           * valor do elemento
           */
          value => {
            inputValueRef.current.value = value;
          }
        }
        {...rest}
      />
    </Container>
  );
};

/**
 * Quando utilizada a função "RefForwardingComponent" do React, é
 * necessário exportá-lo utilizando a função "forwardRef"
 */
export default forwardRef(Input);
