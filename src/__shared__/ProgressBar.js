import { lighten } from 'polished';
import React from 'react';
import styled, { keyframes } from 'styled-components';

import { darkGray, primary } from './colors';
import { animationDuration } from './variables';

const animated = keyframes`
  from {
    background-position: 2rem 0;
  }

  to {
    background-position: 0rem 0;
  }
`;

const Wrapper = styled.div`
  background-color: ${darkGray};
  border-radius: 2px;
  height: 1rem;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

const Filled = styled.div.attrs({
  style: props => ({ width: `${props.value * 100}%` })
})`
  animation: ${animated} 3s linear infinite;
  background-image: repeating-linear-gradient(
    45deg,
    ${primary} 25%,
    ${lighten(0.2, primary)} 25%,
    ${lighten(0.2, primary)} 50%,
    ${primary} 50%,
    ${primary} 75%,
    ${lighten(0.2, primary)} 75%
  );
  background-size: 2rem 2rem;
  color: white;
  align-items: center;
  display: flex;
  font-size: 0.8rem;
  height: 100%;
  justify-content: flex-end;
  transition: width ${animationDuration};
`;

const Label = styled.div`
  align-items: center;
  color: white;
  display: flex;
  font-size: 0.8rem;
  height: 100%;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
`;

function ProgressBar(props) {
  return (
    <Wrapper>
      <Filled value={props.value} />
      <Label value={props.value}>{Math.round(props.value * 100)}%</Label>
    </Wrapper>
  );
}

export default ProgressBar;
