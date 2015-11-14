import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { IoMdAdd as AddIcon } from 'react-icons/io';
import CardList from './CardList';
import Form from './Form';

import data from '../data';

const _getNextNumber = (cards) => {
  let nextNumber = -1;
  for (const id in cards) {
    if (cards[id].number > nextNumber) {
      nextNumber = cards[id].number;
    }
  }
  return nextNumber + 1;
};

const _generateID = () => {
  return Math.random().toString(36).substr(2, 9);
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 75px 10px 10px 10px;
  overflow-y: hidden;
  overflow-x: auto;
`;

const ListsContainer = styled.ol`
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-direction: row;
  margin: 0;
`;

const NewList = styled.button`
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  border-color: transparent;
  width: 275px;
  color: #fff;
  background-color: hsla(0,0%,100%,.24);
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  padding: 10px;
  text-align: left;
  height: fit-content;

  &:hover { 
    background-color: hsla(0,0%,100%,.32);
  }
`;

const NewListText = styled.p`
  margin: 0;
  line-height: 20px;
`;

const AddIconStyled = styled(AddIcon)`
  margin-right: 2px;
  font-size: 20px;
  vertical-align: middle;
`;

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: {},
      cards: {},
      listOrder: [],
      newListText: '',
      creatingNewList: false,
      openMenuId: null,
    };

    this.handleAddCard = this.handleAddCard.bind(this);
    this.handleRemoveCard = this.handleRemoveCard.bind(this);
    this.handleAddList = this.handleAddList.bind(this);
    this.handleRemoveList = this.handleRemoveList.bind(this);
    this.handleRemoveAllCards = this.handleRemoveAllCards.bind(this);
    this.handleCopyList = this.handleCopyList.bind(this);
    this.renderLists = this.renderLists.bind(this);
    this.handleMoveAllCards = this.handleMoveAllCards.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleCopyCard = this.handleCopyCard.bind(this);
    this.handleEditCard = this.handleEditCard.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  componentWillMount() {
    // Init state with data
    this.setState({ lists: data.lists, cards: data.cards, listOrder: data.listOrder });
  }

  handleDragEnd({ destination, source, draggableId, type}) {
    // Drop out of the droppable context
    if (!destination) {
      return;
    }
    // Drop in the exact same place
    if (destination.droppableId === source.droppableId && 
        destination.index === source.index) {
      return;
    }
    // Re-order cards inside the list
    if (type === "card") {
      const lists = {...this.state.lists};
      lists[source.droppableId].cardIds.splice(source.index, 1);
      lists[destination.droppableId].cardIds.splice(destination.index, 0, draggableId);
      this.setState({ lists });
    }
    // Re-order lists inside the board
    if (type === "list") {
      const listOrder = [...this.state.listOrder];
      listOrder.splice(source.index, 1);
      listOrder.splice(destination.index, 0, draggableId);
      this.setState({ listOrder });
    }
  }

  handleAddList(title) {
    if (title) {
      let lists = {...this.state.lists};
      let listOrder = [...this.state.listOrder];
      // Get Id for this new list
      const id = _generateID();
      // Add the new list
      lists[id] = { id, title, cardIds: [] };
      listOrder.push(id);
      // Update state
      this.setState({ lists, listOrder, newListText: '', creatingNewList: false });
    }
    else {
      // Reset
      this.setState({ newListText: '', creatingNewList: false });
    }
  }

  handleRemoveList(listId) {
    let lists = {...this.state.lists};
    let cards = {...this.state.cards};
    let listOrder = [...this.state.listOrder];
    // Delete all cards from this list
    for (let cardId in lists[listId].cardIds) {
      delete cards[cardId];
    }
    // Delete list itself
    delete lists[listId];
    const index = listOrder.indexOf(listId);
    if (index !== -1) {
      listOrder.splice(index, 1);
    }
    // Update state
    this.setState({ lists, cards, listOrder });
  }

  handleAddCard(listId, description) {
    if (!description) {
      return;
    }
    let lists = {...this.state.lists};
    let cards = {...this.state.cards};
    // Get Id for this new card
    const id = _generateID();
    const number = _getNextNumber(cards);
    // Add the new card
    cards[id] = { id, number, description, tags: [] };
    lists[listId].cardIds.push(id);
    // Update state
    this.setState({ lists, cards });
  }

  handleRemoveCard(listId, cardId) {
    let lists = {...this.state.lists};
    let cards = {...this.state.cards};
    // Delete card
    delete cards[cardId];
    // Remove card Id from the corresponding list
    const index = lists[listId].cardIds.indexOf(cardId);
    if (index !== -1) {
      lists[listId].cardIds.splice(index, 1);
    }
    // Update state
    this.setState({ lists, cards });
  }

  handleRemoveAllCards(listId) {
    let lists = {...this.state.lists};
    let cards = {...this.state.cards};
    // Delete all cards from the corresponding list
    for (let cardId in lists[listId].cardIds) {
      delete cards[cardId];
    }
    // Remove card Ids from the list
    lists[listId].cardIds = [];
    // Update state
    this.setState({ cards, lists, openMenuId: null });
  }

  handleCopyCard(listId, cardId) {
    let lists = {...this.state.lists};
    let cards = {...this.state.cards};
    // Create card copy
    const id = _generateID();
    const number = _getNextNumber(cards);
    cards[id] = { id, number, description: cards[cardId].description, tags: [...cards[cardId].tags] };
    // Add it to the list
    lists[listId].cardIds.push(id);
    this.setState({ cards, lists });
  }

  handleCopyList(listId) {
    let lists = {...this.state.lists};
    let cards = {...this.state.cards};
    let listOrder = [...this.state.listOrder];
    let cardIds = [];
    // Copy all cards from list to copy
    for (let i = 0; i < lists[listId].cardIds.length; i++) {
      const id = _generateID();
      const number = _getNextNumber(cards);
      const cardId = lists[listId].cardIds[i];
      cardIds.push(id);
      cards[id] = { id, number, description: cards[cardId].description, tags: [...cards[cardId].tags] };
    }
    // Copy list with Ids for the new copy cards
    const id = _generateID();
    lists[id] = { id, title: '(Copy) - ' + lists[listId].title, cardIds };
    listOrder.push(id);
    // Update state
    this.setState({ cards, lists, listOrder, openMenuId: null });
  }

  handleMoveAllCards(listId) {
    let lists = {...this.state.lists};
    let cardIds = [];
    // Update the lists
    for (let id in lists) {
      if (id !== listId) {
        // Source list
        cardIds.push(...lists[id].cardIds);
        lists[id].cardIds = [];
      }
    }
    // Target list
    console.log(lists[listId].cardIds);
    lists[listId].cardIds.push(...cardIds);
    console.log(lists[listId].cardIds);
    // Update state
    this.setState({ lists, openMenuId: null });
  }

  handleToggleMenu(listId) {
    this.setState({ openMenuId: this.state.openMenuId === listId ? null : listId });
  }

  handleEditCard(cardId, description) {
    let cards = {...this.state.cards};
    // Update card description
    cards[cardId].description = description;
    // Update state
    this.setState({ cards });
  }

  handleRemoveTag(cardId, tagId) {
    let cards = {...this.state.cards};
    // Remove tag from card
    if (cards[cardId]) {
      cards[cardId].tags.splice(tagId, 1);
    }
    // Update state
    this.setState({ cards});
  }

  handleAddTag(cardId, text) {
    let cards = {...this.state.cards};
    // Add tag to the corresponding card
    if (cards[cardId]) {
      cards[cardId].tags.push(text);
    }
    // Update state
    this.setState({ cards });
  }

  renderLists() {
    return (
      <Droppable 
        droppableId="all-lists"
        direction="horizontal"
        type="list"
      >
        {(provided) => (
          <ListsContainer
            ref={provided.innerRef}
            {...this.props.droppableProps}
          >
            { 
              this.state.listOrder.map((listId, index) => {
                const list = this.state.lists[listId];
                const cards = list.cardIds.map(key => this.state.cards[key]);
                return (
                  <li key={list.id}>
                    <CardList 
                      id={list.id}
                      index={index}
                      title={list.title}
                      cards={cards}
                      isMenuOpen={this.state.openMenuId === list.id}
                      onToggleMenu={this.handleToggleMenu}
                      onAddCard={this.handleAddCard}
                      onRemoveCard={this.handleRemoveCard}
                      onRemoveList={this.handleRemoveList}
                      onRemoveAllCards={this.handleRemoveAllCards}
                      onCopyList={this.handleCopyList}
                      onMoveAllCards={this.handleMoveAllCards}
                      onCopyCard={this.handleCopyCard}
                      onEditCard={this.handleEditCard}
                      onRemoveTag={this.handleRemoveTag}
                      onAddTag={this.handleAddTag}
                    />
                </li>
                );
              })
            }
            {provided.placeholder}
          </ListsContainer>
        )}
      </Droppable>
    );
  }

  renderNewList() {
    return (
      this.state.creatingNewList
      ? <Form
          type="list"
          placeholder="Enter a title for this list..."
          buttonText="Add List"
          onClickSubmit={this.handleAddList}
          onClickCancel={() => this.setState({ creatingNewList: false })}
        />
      : <NewList onClick={() => this.setState({ creatingNewList: true })}>
          <AddIconStyled /> 
          { 
            this.state.lists.length === 0 
            ? <NewListText>Add a list</NewListText> 
            : <NewListText>Add another list</NewListText>
          }
        </NewList>
    );
  }

  render() {
    return (
      <DragDropContext 
        onDragEnd={this.handleDragEnd}
        onDragStart={this.handleDragStart}
        onDragUpdate={this.handleDragUpdate}
      >
        <BoardContainer>
          { this.renderLists() }
          { this.renderNewList() }
        </BoardContainer>
      </DragDropContext>
    );
  }
};

export default Board;
