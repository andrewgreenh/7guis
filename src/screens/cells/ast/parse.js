import characterStream from './characterStream';
import tokenStream from './tokenStream';

function parse(rawValue) {
  const tokens = [];
  let tStream = tokenStream(characterStream(rawValue));
  tokens.push(tStream.current);
  while (!tStream.done) {
    tStream = tStream.next();
    tokens.push(tStream.current);
  }
  console.log(tokens);
  return null;
}

export default parse;
