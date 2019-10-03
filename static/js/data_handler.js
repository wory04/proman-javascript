// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json_response => callback(json_response))
    },
    _api_patch: function (url, data) {
        return fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (callback) {
        // creates new board, saves it and calls the callback function with its data
        let postData = {};
        return this._api_post('/board', postData, callback)
    },

    createNewStatus: function (boardId, callback) {
        const newStatusBoard = {'boardId': `${boardId}`};
        const newStatusUrl = '/status';
        return this._api_post(newStatusUrl, newStatusBoard, callback);
    },

    createNewCard: function (statusId, newCardPosition, callback) {
        const newCardStatus = {'statusId': `${statusId}`, 'position': newCardPosition};
        const newCardUrl = '/card';
        return this._api_post(newCardUrl, newCardStatus, callback);
    },

    renameTitle: function (parentId, newName, type) {
        const newNameData = {'id': parentId, 'title': newName};
        const url = `/${type}/${parentId}`;
        return this._api_patch(url, newNameData);
    },

    updateCard: function (statusId, cardId, cardPosition) {
        const movedCard = {'statusId': statusId, 'cardId': cardId, 'position': cardPosition};
        const url = `/card/move`;
        return this._api_patch(url, movedCard);
    },

    updateCards: function (statusId, CardsId, newCardIndex) {
        const movedCards = {'cards': CardsId, 'statusId': statusId, 'newCard': newCardIndex};
        const url = '/cards/move';
        return this._api_patch(url, movedCards)
    }
};
