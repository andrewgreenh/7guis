function getCharacterStream(string, position = 0, completeString = string) {
  return {
    char: string[0],
    completeString,
    position,
    next: () => getCharacterStream(string.substring(1), position + 1, completeString)
  };
}

export default getCharacterStream;
