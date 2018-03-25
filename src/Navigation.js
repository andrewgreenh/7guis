import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { accent, primary } from './__shared__/colors';
import GithubCorner from './GithubCorner';

export const navigationHeight = '3em';

function Navigation({ screens }) {
  return (
    <NavigationContainer>
      <LinkList>
        {screens.map(({ path, name }) => (
          <LinkWrapper key={path}>
            <NavigationLink to={path}>{name}</NavigationLink>
          </LinkWrapper>
        ))}
      </LinkList>
      <GithubCorner />
    </NavigationContainer>
  );
}

export default Navigation;

const NavigationContainer = styled.div`
  background-color: ${primary};
  display: flex;
  height: ${navigationHeight};
  justify-content: space-between;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
`;

const LinkList = styled.ul`
  align-items: center;
  display: flex;
  height: 100%;
  left: 0;
  padding: 0 1rem;
`;

const LinkWrapper = styled.li`
  color: white;
  display: inline-block;
  display: inline-block;
  height: 100%;
  height: 100%;
  list-style: none;
  list-style: none;
  margin-right: 1rem;
  margin-right: 1rem;
  color: white;
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
