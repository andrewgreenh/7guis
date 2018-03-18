import { flatMap, range } from 'lodash';

function expandCellRef(cellRef) {
  if (!cellRef.includes(':')) return [cellRef];
  const match = cellRef.match(/([a-z]+)(\d+):([a-z]+)(\d+)/);
  if (!match) throw new Error('Incorrect range format');
  const [, fromCol, fromRow, toCol, toRow] = match;
  return flatMap(range(+fromRow, +toRow + 1), row =>
    range(alphToNum(fromCol), alphToNum(toCol) + 1).map(
      columnNum => `${numToAlph(columnNum)}${row}`
    )
  );
}

export default expandCellRef;

function alphToNum(alphabetical) {
  let result = 0;
  for (let i = alphabetical.length - 1; i >= 0; i--) {
    let part = alphabetical[i];
    const num = part.charCodeAt(0) - 96;
    result += num * 26 ** (alphabetical.length - (i + 1));
  }
  return result;
}

function numToAlph(number) {
  let string = '';
  while (number > 0) {
    const currentLetterNumber = (number - 1) % 26;
    const currentLetter = String.fromCharCode(currentLetterNumber + 97);
    string = currentLetter + string;
    number = (number - (currentLetterNumber + 1)) / 26;
  }
  return string;
}
