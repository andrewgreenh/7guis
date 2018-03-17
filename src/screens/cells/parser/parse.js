import characterStream from './characterStream';
import parseTokenStream from './parseTokenStream';
import tokenStream from './tokenStream';

function parse(string) {
  return parseTokenStream(tokenStream(characterStream(string)));
}

export default parse;
