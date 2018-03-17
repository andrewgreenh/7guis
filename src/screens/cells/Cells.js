import React from 'react';

import Cell from './Cell';
import CellState from './CellState';
import Grid from './Grid';

const ROW_COUNT = 26;
const COLUMN_COUNT = 26;
const ROW_HEIGHT = 40;
const COLUMN_WIDTH = 200;
const WIDTH = 900;
const HEIGHT = 300;

class Cells extends React.PureComponent {
  cellState = new CellState();

  render() {
    this.cellState.propagateFrom('A1');
    return (
      <Grid
        rowHeight={ROW_HEIGHT}
        rowCount={ROW_COUNT}
        columnWidth={COLUMN_WIDTH}
        columnCount={COLUMN_COUNT}
        height={HEIGHT}
        width={WIDTH}
        renderCellContent={this.renderCellContent}
      />
    );
  }

  renderCellContent = key => <Cell cellKey={key} cellState={this.cellState} />;
}

export default Cells;
