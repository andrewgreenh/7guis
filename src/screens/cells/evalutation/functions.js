import { flatten } from 'lodash';

const functions = {
  sum: (...args) => flatten(args).reduce((a, b) => +a + +b, 0),
  mul: (...args) => flatten(args).reduce((a, b) => +a * +b, 1),
  div: (...args) => flatten(args).reduce((a, b) => +a / +b)
};

export default functions;
