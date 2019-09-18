export const eventHandlers = {
    newCardHandler: function (event, createCard) {
        const boardId = event.target.parentElement.parentElement.id;
        const statusId = event.target.parentElement.nextSibling.id;
        const newCardUrl = `/board/${boardId}/status/${statusId}`;

        fetch(newCardUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(newCardDict => createCard(newCardDict));
    }
};