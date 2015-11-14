import React from 'react';
import styled from 'styled-components';

const DividerContainer = styled.hr`
  background-color: rgba(9,30,66,.13);
  border: 0;
  height: 1px;
`;

const Divider = () => (
  <DividerContainer />
);

export default Divider;
