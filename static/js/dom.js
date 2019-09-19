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
        let addButton = document.querySelector('.board-add');
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
            this._appendToElement(elementToExtend, newBoard, false);
            for (let statuses of board.statuses) {
                if (statuses.length !== 0) {
                    let newStatus = this.statusTemplate(statuses);
                    let statusContainer = document.querySelector(`.board[id='${board.id}'] .board-body`);
                    this._appendToElement(statusContainer, newStatus, false);
                    for (let card of statuses.cards) {
                        if (card.length !== 0) {
                            let newCard = this.cardTemplate(card);
                            let cardContainer = document.querySelector(`.status[id='${statuses.id}'] .cards`);
                            this._appendToElement(cardContainer, newCard, false);
                        }
                    }
                }
            }
        }
        let openButtons = document.querySelectorAll('.open-board');
        for (let openButton of openButtons) {
            openButton.addEventListener('click', this.openBoardHandler);
        }

        let addCardButtons = document.querySelectorAll('.add-card');
        for (let addCardButton of addCardButtons) {
            addCardButton.addEventListener('click', function (event) {
                dom.newCardHandler(event);
            })
        }

        let boardNames = document.querySelectorAll('.board-title');
        for (let boardName of boardNames) {
            boardName.addEventListener('click', this.renameBoardHandler)
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
        let clickedBoard = event.target.parentElement.nextElementSibling;
        clickedBoard.classList.toggle('hide');
    },

    newCardHandler: function (event) {
        const statusId = event.target.parentElement.parentElement.querySelector('.status:first-of-type').id;
        const statusContainer = event.target.parentElement.parentElement.querySelector('.cards');

        dataHandler.createNewCard(statusId, this.cardTemplate).then(
            (newCard) => this._appendToElement(statusContainer, newCard, false)
        );
    },
    renameBoardHandler: function (event) {
        const currentBoardName = event.target.innerText;
        event.target.innerHTML = `<input type="text" placeholder="${currentBoardName}" required maxlength="12">`;
        let boardNames = document.querySelectorAll('.board-title');
        for (let boardName of boardNames) {
            boardName.removeEventListener('click', dom.renameBoardHandler)
        }

        const inputField = document.querySelector('input');
        const boardId = event.target.parentElement.parentElement.id;
        inputField.addEventListener('keyup', function (event) {
            if (event.code === 'Enter') {
                try {
                    if (event.target.checkValidity()) {
                        dataHandler.renameBoard(boardId, inputField.value)
                            .then(response => event.target.parentElement.innerHTML = response.title)
                            .then(function () {
                                let boardNames = document.querySelectorAll('.board-title');
                                for (let boardName of boardNames) {
                                    boardName.addEventListener('click', dom.renameBoardHandler)
                                }
                            })
                    } else {
                        (event.target.parentElement.innerHTML = currentBoardName)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                    }
                }
            }
        })
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
};
