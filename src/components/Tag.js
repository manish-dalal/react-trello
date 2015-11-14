import React from 'react';
import styled from 'styled-components';

const TagContainer = styled.span`
  display: inline-block;
  background-color: #ff9f1a;
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  padding: 2px 8px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

const Tag = (props) => (
  <TagContainer>{props.text}</TagContainer>
);

export default Tag;
