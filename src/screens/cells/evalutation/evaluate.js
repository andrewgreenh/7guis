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
      const args = ast.args.map(node => evaluate(node, statesByKey));
      const func = functions[ast.functionName];
      if (!func) throw new Error(`Unknown function ${ast.functionName}`);
      return functions[ast.functionName](...args);
    }
  }
}

export default evaluate;
