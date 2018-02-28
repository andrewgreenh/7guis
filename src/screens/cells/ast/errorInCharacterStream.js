import { times } from 'lodash';

function errorInCharacterStream(characterStream, error) {
  throw new Error(
    `${error}. At position ${characterStream.state.position}

 ${characterStream.state.string}
${times(characterStream.state.position, () => ' ').join('')}^
`
  );
}

export default errorInCharacterStream;
