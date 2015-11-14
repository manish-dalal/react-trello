import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { IoMdAdd as AddIcon } from 'react-icons/io';
import Card from './Card';
import CardEditor from './CardEditor';
import Menu from './Menu';
import Form from './Form';

const CardListContainer = styled.div`
  background-color: #ebecf0;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  width: 275px;
  margin-right: 10px;
  max-height: 100%;
  padding-right: 10px;
  padding-left: 10px;
`;

const CardListFooter = styled.button`
  display: flex;
  flex-direction: row;
  background-color: transparent;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #5e6c84;
  cursor: pointer;
  padding: 10px 10px;
  margin: 0 -10px;
  font-weight: 500;

  &:focus {
    outline: none;
  }
  &:hover {
    background-color: rgba(9,30,66,.08);
    color: #172b4d;
    text-decoration: underline;
  }
`;

const CardListFooterText = styled.p`
  margin: 0;
  line-height: 20px;
`;

const AddIconStyled = styled(AddIcon)`
  margin-right: 2px;
  font-size: 20px;
  vertical-align: middle;
`;

const CardsContainer = styled.ol`
  overflow: auto;
  list-style: none;
  padding-left: 0;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 5px 0 10px;
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 0;
  padding: 0;
`;

const SubTitle = styled.p`
  margin: 0 0 20px;
  color: #5e6c84;
  padding: 0 10px 0 10px;
`;

class CardList extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      creatingNewCard: false,
      editCardId: null,
      editCardText: '',
      editCardTags: []
    };

    this.actions = [
      [
        { 
          title: 'Add Card...',
          onClick: () => {
            this.props.onToggleMenu(this.props.id);
            this.setState({ creatingNewCard: true });
          }
        },
        { 
          title: 'Copy List...',
          onClick: () => this.props.onCopyList(this.props.id)
        }
      ],
      [
        {
          title: 'Move All Cards in This List...',
          onClick: () => this.props.onMoveAllCards(this.props.id)
        },
        {
          title: 'Archive All Cards in This List...',
          onClick: () => this.props.onRemoveAllCards(this.props.id)
        },
      ],
      [
        {
          title: 'Archive This List',
          onClick: () => this.props.onRemoveList(this.props.id)
        }
      ]
    ];

    this.cardRefs = {};

    this.handleAddNewCard = this.handleAddNewCard.bind(this);
    this.handleCancelNewCard = this.handleCancelNewCard.bind(this);
    this.handleCreateNewCard = this.handleCreateNewCard.bind(this);
    this.handleEditCard = this.handleEditCard.bind(this);
    this.handleCopyCard = this.handleCopyCard.bind(this);
    this.handleArchiveCard = this.handleArchiveCard.bind(this);
    this.handleSaveCard = this.handleSaveCard.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
  }

  handleAddNewCard(cardText) {
    if (cardText) {
      this.props.onAddCard(this.props.id, cardText);
    }
    this.handleCancelNewCard();
  }

  handleCancelNewCard() {
    this.setState({ creatingNewCard: false });
  }

  handleCreateNewCard() {
    this.setState({ creatingNewCard: true });
  }

  handleEditCard(id, text, tags) {
    this.setState({ editCardId: id, editCardText: text, editCardTags: tags });
  }

  handleCopyCard() {
    this.props.onCopyCard(this.props.id, this.state.editCardId);
    this.handleCancelEdit();
  }

  handleArchiveCard() {
    this.props.onRemoveCard(this.props.id, this.state.editCardId);
    this.handleCancelEdit();
  }

  handleSaveCard(text) {
    this.props.onEditCard(this.state.editCardId, text);
    this.handleCancelEdit();
  }

  handleCancelEdit() {
    this.setState({ editCardId: null, editCardText: "", editCardTags: [] });
  }

  handleRemoveTag(tagId) {
    this.props.onRemoveTag(this.state.editCardId, tagId);
  }

  handleAddTag(text) {
    if (text) {
      this.props.onAddTag(this.state.editCardId, text);
    }
  }

  handleCardRef(node, id) {
    if (node) {
      this.cardRefs[id] = node;
    }
  }

  renderHeader(provided) {
    return (
      <div {...provided.dragHandleProps}>
        <TitleContainer>
          <Title>{this.props.title}</Title>
          <Menu
            isOpen={this.props.isMenuOpen} 
            onClick={() => this.props.onToggleMenu(this.props.id)}
            actions={this.actions}
          />
        </TitleContainer>
        <SubTitle>{this.props.cards.length} cards</SubTitle>
      </div>
    );
  }

  renderCards() {
    return (
      <Droppable droppableId={this.props.id} type="card">
        {(provided) => (
          <CardsContainer 
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {
              this.props.cards.map((card, index) => (
                <li 
                  key={card.id}
                  ref={(node) => this.handleCardRef(node, card.id)}
                  onClick={() => this.handleEditCard(card.id, card.description, card.tags)}
                >
                  <Card 
                    id={card.id}
                    index={index}
                    number={card.number}
                    tags={card.tags}
                    description={card.description} 
                  />
                </li>
              ))
            }
            {provided.placeholder}
          </CardsContainer>
        )}
      </Droppable>
    );
  }

  renderFooter() {
    return (
      this.state.creatingNewCard 
      ? <Form
          type="card"
          placeholder="Enter a title for this card..."
          buttonText="Add Card"
          onClickSubmit={this.handleAddNewCard}
          onClickCancel={this.handleCancelNewCard}
        />
      : <CardListFooter onClick={this.handleCreateNewCard}>
          <AddIconStyled />
          { 
            this.props.cards.length === 0 
            ? <CardListFooterText>Add a card</CardListFooterText> 
            : <CardListFooterText>Add another card</CardListFooterText> 
          }
        </CardListFooter>  
    );
  }

  render() {
    return (
      <Draggable
        draggableId={this.props.id}
        index={this.props.index}
      >
        {(provided) => (
          <CardListContainer
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            { this.renderHeader(provided) }
            { this.renderCards() }
            { this.renderFooter() }
            { 
              this.state.editCardId && 
              <CardEditor 
                initialValue={this.state.editCardText}
                tags={this.state.editCardTags}
                position={{
                  top: this.cardRefs[this.state.editCardId].getBoundingClientRect().top,
                  left: this.cardRefs[this.state.editCardId].getBoundingClientRect().left 
                }}
                onCopyCard={this.handleCopyCard}
                onArchiveCard={this.handleArchiveCard}
                onSaveCard={this.handleSaveCard}
                onCancelEdit={this.handleCancelEdit}
                onRemoveTag={this.handleRemoveTag}
                onAddTag={this.handleAddTag}
              /> 
            }
          </CardListContainer>
        )}
      </Draggable>
    );
  }
};

export default CardList;
