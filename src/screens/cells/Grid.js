import { times } from 'lodash';
import { lighten } from 'polished';
import React from 'react';
import styled from 'styled-components';

import { darkGray, lightGray } from '../../__shared__/colors';

const HEADER_HEIGHT = 24;
const FIXED_WIDTH = 30;

const ABC = 'abcdefghijklmnopqrstuvwxyz';

const SCROLLBAR_WIDTH = 12;

const Wrapper = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  position: relative;
`;

const Cell = styled.div.attrs({
  style: props => props
})`
  align-items: center;
  display: flex;
  position: absolute;
`;

const TopLeft = styled.div`
  background-color: ${lighten(0.15, lightGray)};
  border: 1px solid ${lightGray};
  height: ${HEADER_HEIGHT}px;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: ${FIXED_WIDTH}px;
`;

const BottomLeft = styled.div`
  height: ${props => props.height - HEADER_HEIGHT - SCROLLBAR_WIDTH}px;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: ${HEADER_HEIGHT}px;
  width: ${FIXED_WIDTH}px;

  ${Cell} {
    background-color: ${lighten(0.15, lightGray)};
    border: 1px solid ${lightGray};
    border-top: 0;
    justify-content: center;
  }
`;

const TopRight = styled.div`
  height: ${HEADER_HEIGHT}px;
  left: ${FIXED_WIDTH}px;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: ${props => props.width - FIXED_WIDTH - SCROLLBAR_WIDTH}px;

  ${Cell} {
    background-color: ${lighten(0.15, lightGray)};
    border: 1px solid ${lightGray};
    border-left: 0;
    justify-content: center;
  }
`;

const BottomRight = styled.div`
  height: ${props => props.height - HEADER_HEIGHT}px;
  left: ${FIXED_WIDTH}px;
  overflow: scroll;
  position: absolute;
  top: ${HEADER_HEIGHT}px;
  width: ${props => props.width - FIXED_WIDTH}px;

  ::-webkit-scrollbar {
    background-color: ${lightGray};
    height: ${SCROLLBAR_WIDTH}px;
    width: ${SCROLLBAR_WIDTH}px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${darkGray};
  }

  ${Cell} {
    border-right: 1px solid ${lightGray};
    border-bottom: 1px solid ${lightGray};
  }
`;

class Grid extends React.PureComponent {
  render() {
    const {
      height,
      width,
      rowCount,
      rowHeight,
      columnCount,
      columnWidth,
      renderCellContent
    } = this.props;
    return (
      <Wrapper height={height} width={width}>
        <BottomRight width={width} height={height} onScroll={this.handleScroll}>
          {times(rowCount, rowIndex =>
            times(columnCount, columnIndex => (
              <Cell
                key={`${rowIndex}-${columnIndex}`}
                width={columnWidth}
                height={rowHeight}
                top={rowIndex * rowHeight}
                left={columnIndex * columnWidth}
              >
                {renderCellContent(
                  `${ABC[columnIndex]}${rowIndex + 1}`,
                  `${ABC[columnIndex]}`,
                  `${rowIndex + 1}`
                )}
              </Cell>
            ))
          )}
        </BottomRight>
        <TopRight width={width} height={height} innerRef={n => (this.topRight = n)}>
          {times(columnCount, columnIndex => (
            <Cell
              key={columnIndex}
              width={columnWidth}
              height={HEADER_HEIGHT}
              top={0}
              left={columnIndex * columnWidth}
            >
              {ABC[columnIndex]}
            </Cell>
          ))}
        </TopRight>
        <BottomLeft width={width} height={height} innerRef={n => (this.bottomLeft = n)}>
          {times(rowCount, rowIndex => (
            <Cell
              key={rowIndex}
              width={FIXED_WIDTH}
              height={rowHeight}
              top={rowIndex * rowHeight}
              left={0}
            >
              {rowIndex + 1}
            </Cell>
          ))}
        </BottomLeft>
        <TopLeft width={width} height={height} />
      </Wrapper>
    );
  }

  handleScroll = e => {
    this.bottomLeft.scrollTop = e.target.scrollTop;
    this.topRight.scrollLeft = e.target.scrollLeft;
  };
}

export default Grid;
