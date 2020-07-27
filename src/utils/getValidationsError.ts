import { ValidationError } from 'yup';

interface Errors {
  /**
   * Essa notação cria um atributo dinâmico para a interface
   * O nome do parâmetro não necessita ser "key"
   */
  [key: string]: string;
}

export default function getValidationsError(err: ValidationError): Errors {
  const validationsErrors: Errors = {};

  /**
   * Percorre os erros, recuperando as mensagens
   */
  err.inner.forEach(error => {
    /**
     * A notação, no caso [error.path], define a chave dinâmica
     * dentro da interface
     */
    validationsErrors[error.path] = error.message;
  });

  return validationsErrors;
}
