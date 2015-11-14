import React, { useRef } from 'react';
import styled from 'styled-components';
import { useClickOutsideEffect } from '../hooks';
import Divider from './Divider';

const PopoverContainer = styled.div`
  position: absolute;
  margin-top: ${props => props.offset.top ? props.offset.top + 'px' : 0};
  margin-left: ${props => props.offset.left ? props.offset.left + 'px' : 0};
  padding: 15px 10px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 8px 16px -4px rgba(9,30,66,.25), 0 0 0 1px rgba(9,30,66,.08);
  overflow: hidden;
  width: 300px;
`;

const PopoverTitleContainer = styled.div`
  margin-bottom: 10px;
`;

const PopoverTitle = styled.h4`
  margin: 0 0 15px;
  color: #5e6c84;
  text-align: center;
`;

const Popover = ({ title = "Title", children = null, onClickOutside = () => null, offset = {}}) => {
  const popover = useRef(null);

  useClickOutsideEffect(popover, onClickOutside);

  return (
    <PopoverContainer ref={popover} offset={offset}>
      <PopoverTitleContainer>
        <PopoverTitle>{title}</PopoverTitle>
      </PopoverTitleContainer>
      <Divider />
      { children }
    </PopoverContainer>
  );
};

export default Popover;
