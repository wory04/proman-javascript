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
        let addButton = document.querySelector('.add-board');
        addButton.addEventListener('click', this.newBoardHandler);
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
            let currentBoard = this._appendToElement(elementToExtend, newBoard, false);
            for (let statuses of board.statuses) {
                if (statuses.length !== 0) {
                    let newStatus = this.statusTemplate(statuses);
                    this._appendToElement(currentBoard, newStatus, false);
                }
                for (let card of statuses.cards) {
                    if (card.length !== 0) {
                        let newCard = this.cardTemplate(card);
                        let cardContainer = document.querySelector(`.status[id='${statuses.id}'] .cards`);
                        this._appendToElement(cardContainer, newCard, false);
                    }
                }
            }
        }
        let openButtons = document.querySelectorAll('.open-board');
        for (let openButton of openButtons) {
            openButton.addEventListener('click', this.openBoardHandler);
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
    newBoardHandler: function () {
        let boards = document.querySelector('#boards');
        dataHandler.createNewBoard(dom.boardTemplate).then(
            (newBoard) => dom._appendToElement(boards, newBoard, false)
        )

    },

    openBoardHandler: function (event) {
        let clickedBoard = event.currentTarget().parentElement.parentElement;
        clickedBoard.classList.toggle('hide');
    },

    boardTemplate: function (board) {
        return `
        <div id=${board.id} class="board">
            <div class="board-header">
                <span class="board-title">${board.title}</span>
                <button class="add-card">Add Card</button>
                <button class="open-board">Open Board</button>
            </div>    
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
        return `<div id="${card.id}">${card.title}</div>`;
    },


    checkStatuses: function (statuses) {
        return `${statuses ? this.statusTemplate(statuses) : ''}`
    },


    checkCards: function (card) {
        return `${card ? this.cardTemplate(card) : ''}`
    },


};
