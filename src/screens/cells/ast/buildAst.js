import errorInCharacterStream from './errorInCharacterStream';

function defaultHandler(tokenStream) {
  const token = tokenStream.current;
  errorInCharacterStream(tokenStream.state.characterStream, `Unexpected ${token.type} token`);
}

const delegate = stateName => (tokenStream, takenNodes = []) => {
  const state = states[stateName];
  if (tokenStream.current.value === '')
    errorInCharacterStream(tokenStream.state.characterStream, `Unexpected end of input`);
  const handler = state[tokenStream.current.type] || defaultHandler;
  return handler(tokenStream, takenNodes, stateName);
};

const delegateAndTake = stateName => (tokenStream, takenNodes = []) =>
  delegate(stateName)(tokenStream.next(), [...takenNodes, tokenStream.current]);

const delegateAndSkip = stateName => (tokenStream, takenNodes = []) =>
  delegate(stateName)(tokenStream.next(), takenNodes);

const delegateAndReturn = (stateName, returnToStateName) => (tokenStream, takenNodes = []) => {
  const node = delegate(stateName)(tokenStream, []);
  return delegate(returnToStateName)(node.remainingTokens, [...takenNodes, node]);
};

const createPlainNode = tokenStream => ({
  type: 'plainValue',
  value: tokenStream.current,
  remainingTokens: tokenStream.next()
});

const states = {
  initial: {
    number: delegate('plainValue'),
    cellReference: delegate('plainValue'),
    functionCall: delegate('functionCallInitial')
  },
  plainValue: {
    number: createPlainNode,
    cellReference: createPlainNode
  },

  functionCallInitial: {
    functionCall: delegateAndTake('functionCallOpenBracket')
  },
  functionCallOpenBracket: {
    openBracket: delegateAndSkip('functionCallArguments')
  },
  functionCallArguments: {
    closeBracket: delegate('functionCallEnd'),
    number: delegateAndReturn('plainValue', 'functionCallAfterArgument'),
    cellReference: delegateAndReturn('plainValue', 'functionCallAfterArgument'),
    functionCall: delegateAndReturn('functionCallInitial', 'functionCallAfterArgument')
  },
  functionCallAfterArgument: {
    semicolon: delegateAndSkip('functionCallArguments'),
    closeBracket: delegate('functionCallEnd')
  },
  functionCallEnd: {
    closeBracket: (tokenStream, [functionName, ...args]) => ({
      type: 'functionCall',
      functionName: functionName.value,
      args,
      remainingTokens: tokenStream.next()
    })
  }
};

function buildAst(tokenStream) {
  const result = delegate(['initial'])(tokenStream);
  if (!result.remainingTokens.done)
    errorInCharacterStream(
      result.remainingTokens.state.characterStream,
      `Unexpected token after expression.`,
      result.remainingTokens.state.position
    );
  return result;
}

export default buildAst;
