import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { accent, primary } from './__shared__/colors';

export const navigationHeight = '3rem';

const LinkList = styled.ul`
  align-items: center;
  background-color: ${primary};
  display: flex;
  height: ${navigationHeight};
  left: 0;
  padding: 0 1rem;
  position: fixed;
  right: 0;
  top: 0;
`;

const LinkWrapper = styled.li`
  color: white;
  display: inline-block;
  height: 100%;
  list-style: none;
  margin-right: 1rem;
`;

const NavigationLink = styled(NavLink).attrs({
  activeClassName: '__active'
})`
  align-items: center;
  color: white;
  display: flex;
  font-weight: bold;
  height: 100%;
  text-decoration: none;

  &.__active {
    color: ${accent};
  }
`;

function Navigation({ screens }) {
  return (
    <LinkList>
      {screens.map(({ path, name }) => (
        <LinkWrapper key={path}>
          <NavigationLink to={path}>{name}</NavigationLink>
        </LinkWrapper>
      ))}
    </LinkList>
  );
}

export default Navigation;
