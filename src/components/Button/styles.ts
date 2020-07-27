import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

/**
 * Todos os elementos no React Native tem o "display: flex" por padrão
 */

export const Container = styled(RectButton)`
  width: 100%;
  height: 60px;
  background: #ff9000;
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
  padding: 30px;
`;

export const ButtonText = styled.Text`
  font-family: "RobotoSlab-Medium";
  color: #312e38;
  font-size: 18px;
`;
