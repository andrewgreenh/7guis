import { lighten } from 'polished';
import styled from 'styled-components';

import { accent, primary } from './colors';
import { animationDuration } from './variables';

export default styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
  color: ${primary};
  cursor: pointer;
  font-weight: bold;
  padding: 0.3rem;
  text-transform: uppercase;
  transition: all ${animationDuration};

  &:hover {
    background-color: ${lighten(0.4, accent)};
  }

  &:active {
    background-color: ${lighten(0.2, accent)};
  }

  &[disabled] {
    color: ${lighten(0.4, primary)};
    cursor: default;
    background-color: transparent;
  }
`;
