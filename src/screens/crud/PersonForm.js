import React from 'react';
import styled from 'styled-components';

import Input from '../../__shared__/Input';
import { filterHeight } from './PersonSelector';

const Wrapper = styled.div`
  height: 100%;
`;

const FilterPlaceholder = styled.div`
  height: ${filterHeight};
`;

function PersonForm(props) {
  return (
    <Wrapper>
      <FilterPlaceholder />
      <table>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>
              <Input value={props.name} onChange={props.onChange('name')} />
            </td>
          </tr>
          <tr>
            <td>Surname:</td>
            <td>
              <Input value={props.surname} onChange={props.onChange('surname')} />
            </td>
          </tr>
        </tbody>
      </table>
    </Wrapper>
  );
}

export default PersonForm;
