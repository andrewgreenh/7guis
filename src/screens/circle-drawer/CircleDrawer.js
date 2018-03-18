import { filter, minBy, sortBy } from 'lodash';
import React from 'react';
import styled from 'styled-components';

import Button from '../../__shared__/Button';
import { lightGray } from '../../__shared__/colors';
import Input from '../../__shared__/Input';
import { animationDuration } from '../../__shared__/variables';
import ActionHistory from './ActionHistory';

const getDistance = p1 => p2 => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

class CircleDrawer extends React.PureComponent {
  actionHistory = new ActionHistory({});

  state = {
    circlesById: {},
    hoveredCircleId: null,
    selectedCircleId: null,
    undoable: false,
    redoable: false
  };

  componentDidMount() {
    this.unsubsribe = this.actionHistory.onNewState(({ state: circlesById, undoable, redoable }) =>
      this.setState({ circlesById, undoable, redoable })
    );
  }

  componentWillUnmount() {
    this.unsubsribe();
  }

  render() {
    const { circlesById, undoable, redoable, hoveredCircleId, selectedCircleId } = this.state;
    const selectedCircle = circlesById[selectedCircleId];
    const sortedCircles = sortBy(circlesById, ({ id }) => (id === hoveredCircleId ? 1 : 0));
    return (
      <MainFrame>
        <Commands>
          <Button disabled={!undoable} onClick={this.actionHistory.undo}>
            Undo
          </Button>
          <Button disabled={!redoable} onClick={this.actionHistory.redo}>
            Redo
          </Button>
        </Commands>
        <CirclesFrame>
          <SVG
            innerRef={svg => (this.svg = svg)}
            onClick={this.handleClick}
            onMouseMove={this.handleMouseMove}
          >
            {sortedCircles.map(({ id, x, y, r }) => (
              <Circle key={id} cx={x} cy={y} r={r} hovered={id === this.state.hoveredCircleId} />
            ))}
          </SVG>
        </CirclesFrame>
        {selectedCircle ? (
          <React.Fragment>
            <ModalBackdrop onClick={this.close} />
            <Modal>
              <Close onClick={this.close}>X</Close>
              <p>
                Adjust radius of circle (x: {selectedCircle.x} / y: {selectedCircle.y})
              </p>
              <Input
                type="range"
                min={5}
                max={100}
                value={selectedCircle.r}
                onChange={this.handleRadiusChange}
              />
            </Modal>
          </React.Fragment>
        ) : null}
      </MainFrame>
    );
  }

  nextId = 1;

  open = () => this.setState({ selectedCircleId: this.state.hoveredCircleId });

  close = () => {
    this.setState({ selectedCircleId: null });
    this.actionHistory.nextState(this.state.circlesById);
  };

  addCircle = ({ x, y }) => {
    const id = this.nextId++;
    this.actionHistory.nextState({ ...this.state.circlesById, [id]: { id, x, y, r: 20 } });
  };

  getEventCoordinates = e => {
    const { left: svgLeft, top: svgTop } = this.svg.getBoundingClientRect();
    const { clientX: clickLeft, clientY: clickTop } = e;
    const x = Math.round(clickLeft - svgLeft);
    const y = Math.round(clickTop - svgTop);
    return { x, y };
  };

  handleClick = e => {
    if (this.state.hoveredCircleId) this.open();
    else this.addCircle(this.getEventCoordinates(e));
  };

  handleRadiusChange = e => {
    const value = e.target.value;
    this.setState(({ circlesById, selectedCircleId }) => {
      const selectedCircle = circlesById[selectedCircleId];
      return {
        circlesById: {
          ...circlesById,
          [selectedCircleId]: {
            ...selectedCircle,
            r: value
          }
        }
      };
    });
  };

  handleMouseMove = e => {
    const { x, y } = this.getEventCoordinates(e);
    const hoveredCircles = filter(this.state.circlesById, circle => {
      const distance = getDistance({ x, y })(circle);
      return distance < circle.r;
    });
    if (hoveredCircles.length === 0) return this.setState({ hoveredCircleId: null });
    const closest = minBy(hoveredCircles, getDistance({ x, y }));
    this.setState({ hoveredCircleId: closest.id });
  };
}

export default CircleDrawer;

const MainFrame = styled.div`
  border: 1px solid ${lightGray};
  display: flex;
  flex-direction: column;
  height: 300px;
  padding: 0.5rem;
  position: relative;
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
  cursor: pointer;
  fill: ${props => (props.hovered ? lightGray : 'transparent')};
  stroke-width: 1;
  stroke: black;
  transition: fill ${animationDuration};
`;

const ModalBackdrop = styled.div`
  background-color: white;
  bottom: 0;
  left: 0;
  opacity: 0.7;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
`;
const Modal = styled.div`
  background-color: white;
  box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 80%;
  left: 25%;
  width: 50%;
  padding: 1rem;
  text-align: center;
`;
const Close = styled.span`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0.2rem;
`;
