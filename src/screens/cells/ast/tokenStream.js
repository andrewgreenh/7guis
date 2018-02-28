import errorInCharacterStream from './errorInCharacterStream';

const operators = '+ - * /'.split(' ');
const punctuation = '( ) ;'.split(' ');
const characters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const tokenStream = characterStream => tokenStep(characterStream);

export default tokenStream;

function tokenStep(characterStream) {
  let stepDone = false;
  let tokenValue = '';
  let tokenType = null;
  let takeNextCharacter = genericTakeNextCharacter;
  let char = characterStream.current;

  while (!stepDone) {
    skipWhitespace();
    takeNextCharacter();
  }
  return {
    current: { type: tokenType, value: tokenValue },
    state: characterStream,
    done: characterStream.done,
    next: () => tokenStep(characterStream)
  };

  function nextChar() {
    characterStream = characterStream.next();
    char = characterStream.current;
  }

  function skipWhitespace() {
    while (/\s/.test(char)) nextChar();
  }

  function genericTakeNextCharacter() {
    if (characters.includes(char)) return (takeNextCharacter = takeWordCharacter);
    if (punctuation.includes(char)) return (takeNextCharacter = takePunctuationCharacter);
    if (operators.includes(char)) return (takeNextCharacter = takeOperatorCharacter);
    if (/\d/.test(char)) return (takeNextCharacter = takeNumberCharacter);

    throw errorInCharacterStream(characterStream, `Unexpected character '${char}'`);
  }

  function takeWordCharacter() {
    if (/\w|\d/i.test(char)) {
      tokenValue += char;
      nextChar();
    } else {
      stepDone = true;
      tokenType = isCellRef(tokenValue) ? 'cellReference' : 'function';
    }
  }

  function takePunctuationCharacter() {
    tokenValue = char;
    stepDone = true;
    tokenType = 'punctuation';
    nextChar();
  }

  function takeOperatorCharacter() {
    tokenValue = char;
    stepDone = true;
    tokenType = 'operator';
    nextChar();
  }

  function takeNumberCharacter() {
    if (/\.|\d/i.test(char)) {
      tokenValue += char;
      nextChar();
    } else {
      stepDone = true;
      tokenType = 'number';
    }
  }
}

function isCellRef(string) {
  return /\w+\d+/i.test(string);
}
