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
        this.initDrag()
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    addNamesEventListener: function () {
        let boardNames = document.querySelectorAll('.board-title');
        for (let boardName of boardNames) {
            boardName.addEventListener('click', dom.renameHandler);
        }

        let statusNames = document.querySelectorAll('.status-title');
        for (let statusName of statusNames) {
            statusName.addEventListener('click', dom.renameHandler);
        }

    },
    removeNamesEventListener: function () {
        let boardNames = document.querySelectorAll('.board-title');
        for (let boardName of boardNames) {
            boardName.removeEventListener('click', dom.renameHandler);
        }

        let statusNames = document.querySelectorAll('.status-title');
        for (let statusName of statusNames) {
            statusName.removeEventListener('click', dom.renameHandler);
        }
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

        let addStatusButtons = document.querySelectorAll('.add-status');
        for (let addStatusButton of addStatusButtons) {
            addStatusButton.addEventListener('click', this.newStatusHandler)
        }

        let addCardButtons = document.querySelectorAll('.add-card');
        for (let addCardButton of addCardButtons) {
            addCardButton.addEventListener('click', this.newCardHandler)
        }

        this.addNamesEventListener();
    },

    addEventListenersToBoard: function (currentBoard) {
        currentBoard.querySelector('.add-card').addEventListener('click', dom.newCardHandler);
        currentBoard.querySelector('.add-status').addEventListener('click', dom.newStatusHandler);
        currentBoard.querySelector('.open-board').addEventListener('click', dom.openBoardHandler);
        currentBoard.querySelector('.board-title').addEventListener('click', dom.renameHandler);
    },

    newBoardHandler: function () {
        let boards = document.querySelector('#boards');
        dataHandler.createNewBoard(dom.boardTemplate)
            .then((newBoard) => dom._appendToElement(boards, newBoard, false))
            .then((currentBoard) => dom.addEventListenersToBoard(currentBoard))
            .then(() => dataHandler.createNewStatus(document.querySelector('#boards .board:last-of-type')['id'], dom.statusTemplate))
            .then((newStatus) => dom._appendToElement(document.querySelector('#boards .board:last-of-type .board-body'), newStatus, false))
            .then((currentStatus) => currentStatus.querySelector('.status-title').addEventListener('click', dom.renameHandler))
    },

    openBoardHandler: function (event) {
        let clickedBoard = event.target.parentElement.nextElementSibling;
        clickedBoard.classList.toggle('hide');
        event.target.classList.toggle('fa-chevron-up');
        event.target.classList.toggle('fa-chevron-down');
    },

    newStatusHandler: function (event) {
        const boardId = event.target.parentElement.parentElement.id;
        const statusContainer = event.target.parentElement.nextElementSibling;

        dataHandler.createNewStatus(boardId, dom.statusTemplate)
            .then((newStatus) => dom._appendToElement(statusContainer, newStatus, false))
            .then((currentStatus) => currentStatus.querySelector('.status-title').addEventListener('click', dom.renameHandler));
    },

    newCardHandler: function (event) {
        const statusId = event.target.parentElement.parentElement.querySelector('.status:first-of-type').id;
        const statusContainer = event.target.parentElement.parentElement.querySelector('.cards');
        let numberOfCardsInStatus = dom.countCardsInStatus(statusContainer);
        let newCardPosition = parseInt(numberOfCardsInStatus) + 1;
        dataHandler.createNewCard(statusId, newCardPosition, dom.cardTemplate)
            .then((newCard) => dom._appendToElement(statusContainer, newCard, false)
            );
    },

    renameHandler: function (event) {
        const currentName = event.target.innerText;
        event.target.innerHTML = `<input type="text" placeholder="${currentName}" required maxlength="12">`;
        dom.removeNamesEventListener();

        const inputField = document.querySelector('input');
        const parentId = event.target.parentElement.parentElement.id;
        inputField.addEventListener('keyup', function (event) {
                if (event.code === 'Enter') {
                    try {
                        if (event.target.checkValidity()) {
                            dataHandler.renameTitle(parentId, inputField.value, event.target.parentElement.parentElement.parentElement.className)
                                .then(response => event.target.parentElement.innerHTML = response.title)
                                .then(function () {
                                    dom.addNamesEventListener();
                                })
                        } else {
                            (event.target.parentElement.innerHTML = currentName);
                            dom.addNamesEventListener();
                        }
                    } catch (e) {
                        if (e instanceof TypeError) {
                            console.log(e.message);
                        }
                    }
                }
            }
        )
    },

    boardTemplate: function (board) {
        return `
        <div id=${board.id} class="board">
            <div class="board-header">
                <span class="board-title">${board.title}</span>
                <button class="add-status">Add Status</button>
                <button class="add-card">Add Card</button>
                <div class="open-board fas fa-chevron-up"></div>
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
            <div class="card" id="${card.id}" draggable="true">
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
            </div>`
    },


    initDrag: function (){

        document.addEventListener('drag', function(event) {

        }, false);
        document.addEventListener('dragstart', dom.dragStartHandler, false);
        document.addEventListener('dragend', dom.dragEndHandler, false);
        document.addEventListener('dragover', dom.dragOverHandler, false);

        document.addEventListener('dragenter', dom.dragEnterHandler, false);
        document.addEventListener('dragleave', dom.dragLeaveHandler, false);
        document.addEventListener('drop', dom.dropHandler, false);

    },

    dragStartHandler: function (event){
        event.target.dataset.dragged = "true";
        let boardBody = event.target.parentElement.parentElement.parentElement;
        let dropzones = boardBody.querySelectorAll('.status > .cards');
        for (let dropzone of dropzones){
            dropzone.classList.add('dropzone')
        }
    },

    dragEndHandler: function (event){
        event.target.dataset.dragged = "false";
    },

    dragOverHandler: function (event){
        event.preventDefault();
    },

     dragEnterHandler: function (event){
        if (event.target.classList.contains("dropzone") ) {
            event.target.style.background = "grey";

      }
    },

     dragLeaveHandler: function (event){
         if (event.target.classList.contains("dropzone")) {
            event.target.style.background = "";
      }
    },

    dropHandler: function (event){
        let dragged = document.querySelector("[data-dragged='true']");
        event.preventDefault();
        let currentElement = event.target;
        while (!currentElement.classList.contains('dropzone')){
            currentElement = currentElement.parentElement;
        }
        if (currentElement.classList.contains('dropzone') ) {
            currentElement.style.background = "";
            dragged.parentNode.removeChild(dragged);
            let statusId = currentElement.parentElement.id;
            let cardId = dragged.id;

            dataHandler.updateCard(statusId, cardId)
                .then(response => dom.cardTemplate(response))
                .then(card => dom._appendToElement(currentElement, card, false))
                .then(appendCard => dom.getIndexOfCard(currentElement, appendCard))
        }
        if (dragged) {
            dragged.dataset.dragged = 'false';
            dragged = null;
            dom.removeDropzones();

        }

    },
    removeDropzones: function () {
        let dropzones = document.querySelectorAll('.dropzone');
        for (let dropzone of dropzones){
            dropzone.classList.remove('dropzone');
        }

    },

    getIndexOfCard: function (currentElement, dragged){
        let movedCardPosition = Array.from(currentElement.children).indexOf(dragged);
        console.log(movedCardPosition);
    },


    handleMouseMove: function (event) {
        let mouseOffset = event.pageY;
        let supposed = event.pageYOffset;
        console.log(mouseOffset)
        console.log(supposed)
    },

    countCardsInStatus: function (statusContainer) {
        return statusContainer.querySelectorAll('.card').length;
    }
};
