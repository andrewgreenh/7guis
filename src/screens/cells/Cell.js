import { toString } from 'lodash';
import React from 'react';
import styled from 'styled-components';

import Input from '../../__shared__/Input';

const Tooltip = styled.div`
  display: none;
  background-color: lightgoldenrodyellow;
  font-family: monospace;
  font-size: 0.9rem;
  padding: 0.2rem;
  position: absolute;
  top: 100%;
  white-space: pre-wrap;
  z-index: 1;
`;

const Content = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  position: relative;
  width: 100%;

  span {
    padding-left: 0.5rem;
  }

  ${Input} {
    font-size: 1rem;
    height: 100%;
    width: 100%;
  }

  &:hover ${Tooltip} {
    display: block;
  }
`;

class Cell extends React.PureComponent {
  state = {
    rawMode: false,
    rawValue: null,
    value: null,
    error: null,
    inputValue: ''
  };

  componentDidMount() {
    this.unsubscribe = this.props.cellState.subscribeCell(this.props.cellKey, this.updateCellState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.rawMode) {
      return (
        <Content>
          <Input
            value={this.state.inputValue || ''}
            onChange={this.handleInputChange}
            autoFocus
            onFocus={this.handleInputFocus}
            onKeyDown={this.handleInputKeyDown}
            onBlur={this.handleInputBlur}
          />
        </Content>
      );
    }
    return (
      <Content onDoubleClick={this.handleDblClick}>
        <span>{toString(this.state.value == null ? this.state.rawValue : this.state.value)}</span>
        {this.state.error && <Tooltip>{this.state.error}</Tooltip>}
      </Content>
    );
  }

  handleDblClick = () => this.setState(state => ({ rawMode: true, inputValue: state.rawValue }));

  handleInputBlur = () => this.cancel();

  handleInputFocus = e => e.target.select();

  handleInputChange = e => this.setState({ inputValue: e.target.value });

  handleInputKeyDown = e => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.cancel();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      this.save();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      this.save();
    }
  };

  cancel = () => this.setState({ rawMode: false });

  save = () => {
    this.setState({ rawMode: false });
    this.props.cellState.updateRaw(this.props.cellKey, this.state.inputValue);
  };

  updateCellState = cellState => this.setState(cellState);
}

export default Cell;
