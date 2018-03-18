# Cells

This one was tricky. Firstly a Grid Component was built that renderes some data into a grid form. By using the render prop pattern, this component can render arbitrary content inside of the cells.

```jsx
class Cells extends React.PureComponent {
  cellState = new CellState();

  render() {
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
```

The "magic" of this task lives inside the `CellState` class. In there are the raw and evaluated values of each cell. Each Cell component subscribes to the cellState with its own key, so that only updated cells are rerendered.

Since React is only helping you with the view part of your UI, the CellState class had to be written from scratch (because I didn't want to add any other libraries) and is kind of complex.
Expression parsing, dependency extraction and value evaltuation had to be done by hand which was quite the ordeal. However the integration of this custom class into the React world has been really simply by using the observer pattern. This way, the UI is cleanly separated from the logic and the logic part could be easily swapped by providing a different state manager via props.
