import React, { useState, useEffect } from 'react';
import { useClickOutsideEffect } from '../hooks';
import styled from 'styled-components';
import { IoMdClose as CancelIcon } from 'react-icons/io';
import Button from './Button';

const FormContainer = styled.form`
  padding: ${props => props.type === "list" ? "10px" : "0px"};
  background-color: ${props => props.type === "list" ? "#ebecf0" : null};
  border-radius: 3px;
  width: ${props => {
    switch(props.type) {
      case 'list': return '275px';
      case 'editor': return '270px';
      case 'card': return '250px';
      default: return '250px';
    }
  }};
  height: fit-content;
`;

const FormHeader = styled.div`
  background-color: #fff;
  border-radius: 3px 3px 0px 0px;
`;

const FormTextArea = styled.textarea`
  background-color: #fff;
  border-radius: ${props => props.formHasHeader ? "0px 0px 3px 3px" : "3px"};
  box-shadow: 0 1px 0 rgba(9,30,66,.25);
  margin-bottom: 8px;
  min-height: 50px;
  max-height: 250px;
  padding: 10px;
  font-size: 14px;
  border: none;
  overflow: hidden;
  resize: none;
  width: 250px;
  outline: none;
`;

const FormInput = styled.input`
  background-color: #fff;
  border-radius: 3px;
  padding: 10px;
  font-size: 14px;
  border: none;
  box-shadow: inset 0 0 0 2px #0079bf;
  overflow: hidden;
  overflow-y: scroll;
  display: block;
  margin-bottom: 5px;
  width: 250px;
  outline: none;
`;

const ButtonsContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CancelIconStyled = styled(CancelIcon)`
  cursor: pointer;
  color: #6b778c;
  font-size: 25px;

  &:hover {
    color: #172b4d;
  }
`;

const Form = (props) => {
  const [inputText, setInputText] = useState(props.initialValue || '');
  const form = React.createRef();
  const textarea = React.createRef();
  const input = React.createRef();

  function handleOnChangeText(e) {
    setInputText(e.target.value);
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    props.onClickSubmit(inputText);
    setInputText('');
  }

  function handleOnKeyDown(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      handleOnSubmit(e);
    }
  }

  useEffect(() => {
    if (input && input.current) {
      input.current.focus();
    }
    if (textarea && textarea.current) {
      textarea.current.focus();
    }
  });
  
  useClickOutsideEffect(form, props.onClickCancel);

  const options = {
    type: "text", 
    value: inputText,
    placeholder: props.placeholder,
    onChange: handleOnChangeText
  };

  return (
    <FormContainer type={props.type} ref={form}>
      <FormHeader>
        { props.children }
      </FormHeader>
      {
        props.type === 'list' || props.type === 'labels' 
        ? <FormInput 
            {...options} 
            ref={input}
          /> 
        : <FormTextArea 
            {...options} 
            ref={textarea} 
            editor={props.type === "editor"}
            formHasHeader={props.children ? true : false}
            onKeyDown={handleOnKeyDown} 
          />
      } 
      <ButtonsContainer>
        <Button 
          text={props.buttonText}
          onClick={handleOnSubmit} 
        />
        {
          props.onClickCancel &&
          <CancelIconStyled onClick={props.onClickCancel} />
        }
      </ButtonsContainer>
    </FormContainer>
  );
};

export default Form;
