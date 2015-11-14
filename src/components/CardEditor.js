import React, { useState } from 'react';
import { useClickOutsideEffect } from '../hooks';
import styled from 'styled-components';
import { 
  IoMdCopy as CopyIcon, 
  IoMdArchive as ArchiveIcon,
  IoMdCreate as EditIcon,
  IoMdClose as RemoveIcon  
} from 'react-icons/io';
import Button from './Button';
import Form from './Form';
import Popover from './Popover';
import Tag from './Tag';

const EditorContainer = styled.div`
  background: rgba(0,0,0,.6);
  color: #fff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
`;

const Editor = styled.div`
  position: absolute;
  top: ${props => props.position.top + "px"};
  left: ${props => props.position.left + "px"};
  display: flex;
  flex-direction: row;
`;

const EditorCard = styled.div`
  display: flex;
  flex-direction: column;
`;

const TagsContainer = styled.div`
  padding: 10px 10px 0 10px;
`;

const EditorButtons = styled.ul`
  list-style: none;
  padding-left: 10px;
`;

const EditorButton = styled.li`
  margin-bottom: 5px;
`;

const PopoverLabels = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PopoverLabel = styled.li`
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin: 0 -10px;
  cursor: pointer;

  &:hover {
    background-color: rgba(9,30,66,.04);
  }
`;

const PopoverLabelTitle = styled.p`
  margin: 0;
  color: #000;
  line-height: 20px;
  margin-left: 5px;
`;

const RemoveIconStyled = styled(RemoveIcon)`
  color: tomato;
  font-size: 20px;
  vertical-align: middle;
`;

const PopoverNewLabelTitle = styled.h4`
  margin: 15px 0;
  color: #5e6c84;
  font-size: 12px;
  text-transform: uppercase;
`;

const CardEditor = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const editor = React.createRef();

  useClickOutsideEffect(editor, props.onCancelEdit);

  return (
    <EditorContainer>
      <Editor ref={editor} position={props.position}>
        <EditorCard>
          <Form 
            type='editor'
            buttonText="Save"
            initialValue={props.initialValue}
            onClickSubmit={props.onSaveCard}
          >
            {
              props.tags && props.tags.length > 0 &&
              <TagsContainer>
              {
                props.tags.map((tag, i) => (
                  <Tag key={i} text={tag} />
                ))
              }
              </TagsContainer>
            }
          </Form>
        </EditorCard>
        <EditorButtons>
          <EditorButton>
            <Button 
              icon={<EditIcon />}
              text="Edit Labels" 
              type="editor"
              onClick={() => setIsOpen(true)}
            />
            {
              isOpen &&
              <Popover
                title="Labels"
                offset={{ top: -35 }}
                onClickOutside={() => setIsOpen(false)}
              >
              {
                <div>
                  <PopoverLabels>
                    {
                      props.tags.map((tag, i) => (
                        <PopoverLabel 
                          key={i}
                          onClick={() => props.onRemoveTag(i)}
                        >
                          <RemoveIconStyled />
                          <PopoverLabelTitle>{tag}</PopoverLabelTitle>
                        </PopoverLabel>
                      )) 
                    } 
                  </PopoverLabels>
                  <PopoverNewLabelTitle>Add a new label</PopoverNewLabelTitle>
                  <Form 
                    type="labels"
                    buttonText="Add"
                    placeholder="Enter a name for this label..."
                    onClickSubmit={props.onAddTag}
                  />
                </div>
              }
              </Popover>
            }
          </EditorButton>
          <EditorButton>
            <Button 
              icon={<CopyIcon />}
              text="Copy" 
              type="editor"
              onClick={props.onCopyCard}
            />
          </EditorButton>
          <EditorButton>
            <Button 
              icon={<ArchiveIcon />}
              text="Archive"
              type="editor"
              onClick={props.onArchiveCard}
            />
          </EditorButton>
        </EditorButtons>
      </Editor>
    </EditorContainer>
  );
};

export default CardEditor;
