import { flatMap } from 'lodash';

import expandCellRef from '../utils/expandCellRef';
import functions from './functions';

function evaluate(ast, statesByKey) {
  if (!ast) return null;
  switch (ast.type) {
    case 'plainValue': {
      if (ast.value.type === 'number') return ast.value.value;
      const cellRefs = expandCellRef(ast.value.value);
      return cellRefs.map(cellKey => {
        if (!statesByKey[cellKey]) return null;
        if (statesByKey[cellKey].value === 'PENDING') throw new Error('Circular dependencies');
        return statesByKey[cellKey].value;
      });
    }

    case 'functionCall': {
      const args = flatMap(ast.args, node => evaluate(node, statesByKey));
      return functions[ast.functionName](...args);
    }
  }
}

export default evaluate;
