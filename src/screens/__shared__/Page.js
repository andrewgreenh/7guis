import styled from 'styled-components';

import { navigationHeight } from '../../Navigation';

export const Page = styled.div`
  padding: 1rem;
  padding-top: calc(${navigationHeight} + 1rem);
`;
