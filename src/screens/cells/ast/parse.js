import buildAst from './buildAst';
import characterStream from './characterStream';
import tokenStream from './tokenStream';

function parse(rawValue) {
  const tokens = [];
  let tStream = tokenStream(characterStream(rawValue));
  const ast = buildAst(tStream);
  console.log(ast);
  tokens.push(tStream.current);
  while (!tStream.done) {
    tStream = tStream.next();
    tokens.push(tStream.current);
  }
  return null;
}

export default parse;
