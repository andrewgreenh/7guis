import { times } from 'lodash';

function errorInCharacterStream(characterStream, error, customPosition) {
  throw new Error(
    `${error}. At position ${customPosition || characterStream.state.position}

 ${characterStream.state.string}
${times(customPosition || characterStream.state.position, () => ' ').join('')}^
`
  );
}

export default errorInCharacterStream;
