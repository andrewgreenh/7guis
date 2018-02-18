import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`;

function Label({ label, children }) {
  return (
    <Wrapper>
      {children}
      <label>{label}</label>
    </Wrapper>
  );
}

Label.Wrapper = Wrapper;

export default Label;
