import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: rgba(0,0,0,.15);
  text-align: center;
  height: 55px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  line-height: 55px;
  color: #fff;
  font-style: italic;
`;

const Header = () => (
  <HeaderContainer>
    <HeaderTitle>React Trello</HeaderTitle>
  </HeaderContainer>
);

export default Header;
