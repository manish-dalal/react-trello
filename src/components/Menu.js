import React from 'react';
import styled from 'styled-components';
import { IoIosMore as MoreIcon } from 'react-icons/io';
import Popover from './Popover';
import Divider from './Divider';

const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuIcon = styled(MoreIcon)`
  color: #6b778c;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  font-size: 20px;

  &:hover {
    color: #172b4d;
    background-color: rgba(9,30,66,.08);
  }
`;

const PopoverActionsContainer = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PopoverAction = styled.li`
  padding: 10px;
  margin: 0 -10px;
  cursor: pointer;

  &:hover {
    background-color: rgba(9,30,66,.04);
  }
`;

const PopoverActionTitle = styled.p`
  margin: 0;
`;

const Menu = ({ isOpen = false, actions = [], onClick = () => null }) => (
  <MenuContainer>
    <MenuIcon onClick={onClick} />
    { 
      isOpen && 
      <Popover
        title="List Actions"
        onClickOutside={onClick}
      >
      {
        actions.map((list, i) => (
          <div key={i}>
            <PopoverActionsContainer>
              {
                list.map((action, j) => (
                  <PopoverAction
                    key={j}
                    onClick={action.onClick}
                  >
                    <PopoverActionTitle>{action.title}</PopoverActionTitle>
                  </PopoverAction>
                ))
              }
            </PopoverActionsContainer>
            <Divider />
          </div>
        ))
      }
      </Popover> 
    }
  </MenuContainer>
);

export default Menu;
