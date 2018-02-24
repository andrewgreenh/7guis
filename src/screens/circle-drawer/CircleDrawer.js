import { filter, initial, last, minBy } from 'lodash';
import React from 'react';
import styled from 'styled-components';

import Button from '../../__shared__/Button';
import { lightGray } from '../../__shared__/colors';
import { animationDuration } from '../../__shared__/variables';

const MainFrame = styled.div`
  border: 1px solid ${lightGray};
  display: flex;
  flex-direction: column;
  height: 300px;
  padding: 0.5rem;
  width: 400px;
`;

const Commands = styled.div`
  flex: 0 0 auto;
  padding-bottom: 0.5rem;
  text-align: center;

  ${Button} + ${Button} {
    margin-left: 0.5rem;
  }
`;

const CirclesFrame = styled.div`
  border: 1px solid black;
  flex: 1 1 auto;
  height: 100%;
  overflow: hidden;
`;

const SVG = styled.svg`
  height: 100%;
  width: 100%;
`;

const Circle = styled.circle`
  fill: ${props => (props.selected ? lightGray : 'transparent')};
  stroke-width: 1;
  stroke: black;
  transition: fill ${animationDuration};
`;

const getDistance = p1 => p2 => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

class CircleDrawer extends React.PureComponent {
  state = {
    circlesById: {},
    redoStack: [],
    selectedCircleId: null,
    undoStack: []
  };

  render() {
    return (
      <MainFrame>
        <Commands>
          <Button disabled={this.state.undoStack.length === 0} onClick={this.undo}>
            Undo
          </Button>
          <Button disabled={this.state.redoStack.length === 0} onClick={this.redo}>
            Redo
          </Button>
        </Commands>
        <CirclesFrame>
          <SVG
            innerRef={svg => (this.svg = svg)}
            onClick={this.handleClick}
            onMouseMove={this.handleMouseMove}
          >
            {Object.values(this.state.circlesById).map(({ id, x, y, r }) => (
              <Circle key={id} cx={x} cy={y} r={r} selected={id === this.state.selectedCircleId} />
            ))}
          </SVG>
        </CirclesFrame>
      </MainFrame>
    );
  }

  nextId = 1;

  addCircle = ({ x, y }) => {
    const id = this.nextId++;
    this.setState(state => ({
      circlesById: { ...state.circlesById, [this.nextId++]: { id, x, y, r: 20 } },
      redoStack: [],
      undoStack: [...state.undoStack, state.circlesById]
    }));
  };

  getEventCoordinates = e => {
    const { left: svgLeft, top: svgTop } = this.svg.getBoundingClientRect();
    const { clientX: clickLeft, clientY: clickTop } = e;
    const x = clickLeft - svgLeft;
    const y = clickTop - svgTop;
    return { x, y };
  };

  handleClick = e => {
    if (this.state.selectedCircleId) {
    } else {
      this.addCircle(this.getEventCoordinates(e));
    }
  };

  handleMouseMove = e => {
    const { x, y } = this.getEventCoordinates(e);
    const hoveredCircles = filter(this.state.circlesById, circle => {
      const distance = getDistance({ x, y })(circle);
      return distance < circle.r;
    });
    if (hoveredCircles.length === 0) return this.setState({ selectedCircleId: null });
    const closest = minBy(hoveredCircles, getDistance({ x, y }));
    this.setState({ selectedCircleId: closest.id });
  };

  undo = () => {
    this.setState(state => {
      const currentState = state.circlesById;
      const lastState = last(state.undoStack);
      return {
        circlesById: lastState,
        undoStack: initial(state.undoStack),
        redoStack: [...state.redoStack, currentState]
      };
    });
  };

  redo = () => {
    this.setState(state => {
      const currentState = state.circlesById;
      const nextState = last(state.redoStack);
      return {
        circlesById: nextState,
        undoStack: [...state.undoStack, currentState],
        redoStack: initial(state.redoStack)
      };
    });
  };
}

export default CircleDrawer;
