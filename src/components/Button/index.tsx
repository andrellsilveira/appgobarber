import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

/**
 * Interface que herda as propriedades do rectbutton e torna a propriedade
 * "children" obrigatória e define que seu valor só poderá ser do tipo texto
 */
interface ButtonProps extends RectButtonProperties {
  children: string;
}

const Button: React.FC<ButtonProps> = ({children, ...rest}) => {
  return (
    <Container {...rest}>
      {
        /**
         * Todo texto no React Native deve estar dentro de um componente "Text"
         */
      }
      <ButtonText>{children}</ButtonText>
    </Container>
  );
}

export default Button;
