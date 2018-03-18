import errorInCharacterStream from './errorInCharacterStream';

const characters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const tokenStream = characterStream => tokenStep(characterStream);

export default tokenStream;

function tokenStep(characterStream) {
  let stepDone = false;
  let tokenValue = '';
  let tokenType = null;
  let takeNextCharacter = genericTakeNextCharacter;
  let char = characterStream.current;
  let startOfToken = characterStream.state.position;

  while (!stepDone) {
    skipWhitespace();
    takeNextCharacter();
  }
  return {
    current: { type: tokenType, value: tokenValue },
    state: {
      characterStream,
      position: startOfToken
    },
    done: tokenValue === '',
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
    if (char === '(') return (takeNextCharacter = () => takePunctuationCharacter('openBracket'));
    if (char === ')') return (takeNextCharacter = () => takePunctuationCharacter('closeBracket'));
    if (char === ';') return (takeNextCharacter = () => takePunctuationCharacter('semicolon'));
    if (/\d/.test(char)) return (takeNextCharacter = takeNumberCharacter);

    if (char === '') return (takeNextCharacter = finish);
    throw errorInCharacterStream(characterStream, `Unexpected character '${char}'`);
  }

  function finish() {
    stepDone = true;
    tokenType = 'DONE';
  }

  function takeWordCharacter() {
    if (/\w|\d|:/i.test(char)) {
      tokenValue += char;
      nextChar();
    } else {
      stepDone = true;
      tokenType = isCellRef(tokenValue) ? 'cellReference' : 'functionCall';
    }
  }

  function takePunctuationCharacter(type) {
    tokenValue = char;
    stepDone = true;
    tokenType = type;
    nextChar();
  }

  function takeNumberCharacter() {
    if (/\.|\d/i.test(char)) {
      tokenValue += char;
      nextChar();
    } else {
      tokenValue = parseFloat(tokenValue);
      stepDone = true;
      tokenType = 'number';
    }
  }
}

function isCellRef(string) {
  return /\w+\d+(:\w+\d+)?/i.test(string);
}
