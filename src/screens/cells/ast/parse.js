import getCharacterStream from './getCharacterStream';
import getTokenStream from './getTokenStream';

function parse(rawValue) {
  const tokens = [];
  let tokenStream = getTokenStream(getCharacterStream(rawValue));
  while (tokenStream) {
    tokens.push(tokenStream.token);
    tokenStream = tokenStream.next();
  }
  console.log(tokens);
  return null;
}

export default parse;
