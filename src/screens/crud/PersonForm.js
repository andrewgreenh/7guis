import React from 'react';
import styled from 'styled-components';

import Input from '../../__shared__/Input';

function PersonForm(props) {
  return (
    <Wrapper>
      <Cell col={1} row={1}>
        Name:
      </Cell>
      <Cell col={2} row={1}>
        <Input value={props.name} onChange={props.onChange('name')} />
      </Cell>
      <Cell col={1} row={2}>
        Surname:
      </Cell>
      <Cell col={2} row={2}>
        <Input value={props.surname} onChange={props.onChange('surname')} />
      </Cell>
    </Wrapper>
  );
}

export default PersonForm;

const Wrapper = styled.div`
  display: grid;
  grid-column: 2;
  grid-gap: 0.5rem 0.5rem;
  grid-row: 2;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto 1fr;
  height: 100%;
  padding: 0.5rem;
`;

const Cell = styled.div`
  grid-column: ${props => props.col};
  grid-row: ${props => props.row};

  ${Input} {
    width: 100%;
  }
`;
