import expandCellRef from './expandCellRef';

function getDependencies(ast, dependencies = new Set()) {
  switch (ast.type) {
    case 'plainValue': {
      if (ast.value.type !== 'cellReference') return dependencies;
      const cellRefs = expandCellRef(ast.value.value);
      cellRefs.forEach(ref => dependencies.add(ref));
      return dependencies;
    }
    case 'functionCall': {
      ast.args.forEach(node => getDependencies(node, dependencies));
      return dependencies;
    }
  }
}

export default getDependencies;
