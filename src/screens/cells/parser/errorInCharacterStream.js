import { times } from 'lodash';

function errorInCharacterStream(characterStream, error, customPosition) {
  const errorObject = new Error(
    `${error}. At position ${customPosition || characterStream.state.position}

 ${characterStream.state.string}
${times(customPosition || characterStream.state.position, () => ' ').join('')}^
`
  );
  errorObject.position = customPosition || characterStream.state.position;
  errorObject.plainText = error;
  throw errorObject;
}

export default errorInCharacterStream;
