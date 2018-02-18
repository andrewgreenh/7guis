import styled from 'styled-components';

import { lightGray, primary } from './colors';
import { animationDuration } from './variables';

export default styled.input`
  border: 1px solid ${lightGray};
  padding: 0.3rem;
  transition: border ${animationDuration};

  &:focus {
    border-color: ${primary};
  }
`;
