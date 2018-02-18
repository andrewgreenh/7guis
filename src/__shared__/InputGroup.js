import styled from 'styled-components';
import Label from './Label';

export default styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  ${Label.Wrapper} {
    padding-left: 1rem;

    &:first-child {
      padding-left: 0;
    }
  }
`;
