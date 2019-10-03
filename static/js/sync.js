import {dom} from "./dom.js";

export const sync = {
    socket: io.connect(),
    hoverCard: undefined,
    dragStartPosition: {
        x: 0,
        y: 0
    },
    init: () => {
        sync.socket.on('data-changed', (data) => {
            const movingCard = document.querySelector(`.card[id="${data.id}"]`);

            if(!sync.hoverCard) {
                sync.hoverCard = movingCard.cloneNode(true);
                movingCard.parentElement.appendChild(sync.hoverCard);
            }

            sync.hoverCard.classList.add('hover-card');
            sync.hoverCard.style.width = `${movingCard.offsetWidth}px`;
            sync.hoverCard.style.height = `${movingCard.offsetHeight}px`;
            sync.hoverCard.style.left = `${data.x}px`;
            sync.hoverCard.style.top = `${data.y}px`;
        });

        sync.socket.on('drag_end', () => {
            sync.hoverCard.remove();
            sync.hoverCard = undefined;
        });

        sync.socket.on('drop', (data) => {
            dom.changeCardStatus(data.statusId, data.cardId);
        });
    },
    setDragStartCoordinates: (x, y) => {
        sync.dragStartPosition = {x, y};
    },
    sendDragData: (id, x, y) => {
        sync.socket.emit('drag_data', {
            id: id,
            x: x - sync.dragStartPosition.x,
            y: y - sync.dragStartPosition.y
        });
    },
    sendDragEndData: () => {
        sync.socket.emit('drag_end');
    },
    sendDropData: (statusId, cardId) => {
        sync.socket.emit('drop', {statusId, cardId});
    }
};