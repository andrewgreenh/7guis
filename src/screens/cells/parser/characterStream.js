const characterStream = string => characterStep({ string, position: 0 });

export default characterStream;

function characterStep({ string, position }) {
  const nextState = { string, position: position + 1 };
  return {
    current: (string[position] || '').toLowerCase(),
    state: nextState,
    done: string[position] === undefined,
    next: () => characterStep(nextState)
  };
}
