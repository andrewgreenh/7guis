import { times } from 'lodash';

const operators = '+ - * /'.split(' ');
const punctuation = '( ) ;'.split(' ');

function getTokenStream(characterStream) {
  if (!characterStream.char) return null;
  if (whitespaceNext(characterStream)) return takeWhitespace(characterStream);
  if (numberNext(characterStream)) return takeNumber(characterStream);
  if (operatorNext(characterStream)) return takeOperator(characterStream);
  if (punctuationNext(characterStream)) return takePunctuation(characterStream);
  beautifullError(characterStream);
}

function whitespaceNext(characterStream) {
  return !!characterStream.char.match(/^\s/);
}

function takeWhitespace(characterStream) {
  while (characterStream.char && characterStream.char.match(/^\s/)) {
    characterStream = characterStream.next();
  }
  return getTokenStream(characterStream);
}

function numberNext(characterStream) {
  return !!characterStream.char.match(/^\d/);
}
function takeNumber(characterStream) {
  let numberString = '';
  while (characterStream.char && characterStream.char.match(/^\d|\./)) {
    numberString += characterStream.char;
    characterStream = characterStream.next();
  }
  return {
    token: {
      type: 'number',
      value: numberString
    },
    next: () => getTokenStream(characterStream)
  };
}

function operatorNext(characterStream) {
  return operators.includes(characterStream.char);
}
function takeOperator(characterStream) {
  return {
    token: {
      type: 'operator',
      value: characterStream.char
    },
    next: () => getTokenStream(characterStream.next())
  };
}

function punctuationNext(characterStream) {
  return punctuation.includes(characterStream.char);
}
function takePunctuation(characterStream) {
  return {
    token: {
      type: 'punctuation',
      value: characterStream.char
    },
    next: () => getTokenStream(characterStream.next())
  };
}

function beautifullError(characterStream) {
  throw new Error(
    `Unexpected character '${characterStream.char}' at position ${characterStream.position}

${characterStream.completeString}
${times(characterStream.position, () => ' ').join('')}^
`
  );
}

export default getTokenStream;
