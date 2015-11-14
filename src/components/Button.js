import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.button`
  background-color: ${props => props.type === "success" ? "#5aac44" : "rgba(0,0,0,.6)"};
  border: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 3px;
  font-weight: 600;
  padding: 0px 15px;
  outline: none;
  display: flex;
  flex-direction: row;

  &:hover {
    background-color: ${props => props.type === "success" ? "#61bd4f" : "rgba(0,0,0,.8)"};
    transform: ${props => props.type === "editor" ? "translateX(5px)" : null};
  }
`;

const ButtonIcon = styled.div`
  font-size: 15px;
  line-height: 35px;
  margin-right: 5px;
`;

const ButtonText = styled.div`
  line-height: 35px;
`;

const Button = ({ text = '', icon = null, onClick = null, type="success" }) => (
  <ButtonContainer 
    onClick={onClick} 
    type={type}
  >
    { icon !== null ? <ButtonIcon>{ icon }</ButtonIcon> : null }
    <ButtonText>{ text }</ButtonText>
  </ButtonContainer>
);

export default Button;
