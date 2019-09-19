// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }
        return elementToExtend.lastChild;
    },
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let elementToExtend = document.getElementById('boards');

        for (let board of boards) {
            let newBoard = this.boardTemplate(board);
            this._appendToElement(elementToExtend, newBoard , false);
            for (let statuses of board.statuses) {
                let newStatus = this.checkStatuses(statuses);
                let statusContainer = document.querySelector(`.board[id='${board.id}'] .board-body`);
                this._appendToElement(statusContainer, newStatus, false);
                for (let card of statuses.cards) {
                    let newCard = this.checkCards(card);
                    let cardContainer = document.querySelector(`.status[id='${statuses.id}'] .cards`);
                    this._appendToElement(cardContainer, newCard, false);
                }
            }
        }

        let addCardButtons = document.querySelectorAll('.add-card');

        for (let addCardButton of addCardButtons) {
            addCardButton.addEventListener('click', function (event) {
                dom.newCardHandler(event);
            })
        }
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
    newCardHandler: function (event) {
        const statusId = event.target.parentElement.parentElement.querySelector('.status:first-of-type').id;
        const statusContainer = event.target.parentElement.parentElement.querySelector('.cards');

        dataHandler.createNewCard(statusId, this.cardTemplate).then(
            (newCard) => this._appendToElement(statusContainer, newCard, false)
        );

    },

    boardTemplate: function (board) {
        return `
        <div id=${board.id} class="board">
            <div class="board-header">
                <span class="board-title">${board.title}</span>
                <button class="add-card">Add Card</button>
                <div class="open-board fas fa-angle-down"></div>
            </div>
            <div class="board-body"></div>   
        </div>
      `
    },


    statusTemplate: function (status) {
        return `<div id="${status.id}" class="status">
                        <div class="status-header"> 
                            <span class="status-title">${status.title}</span>
                        </div>
                        <div class="cards"></div>   
                    </div>
                    `
    },


    cardTemplate: function (card) {
        return `
            <div class="card" id="${card.id}">
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
            </div>`
    },


    checkStatuses: function (statuses) {
        return `${statuses ? this.statusTemplate(statuses) : ''}`
    },


    checkCards: function (card) {
        return `${card ? this.cardTemplate(card) : ''}`
    },


};
