ALTER TABLE IF EXISTS ONLY public.status DROP CONSTRAINT IF EXISTS fk_status_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS fk_card_status_id CASCADE;

DROP TABLE IF EXISTS public.board;
DROP SEQUENCE IF EXISTS public.board_id_seq;
DROP TABLE IF EXISTS public.status;
DROP SEQUENCE IF EXISTS public.status_id_seq;
DROP TABLE IF EXISTS public.card;
DROP SEQUENCE IF EXISTS public.card_id_seq;

CREATE TABLE board (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(200) NOT NULL DEFAULT 'New Board'
);

CREATE TABLE status (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(200) NOT NULL DEFAULT 'New Status',
    board_id INTEGER NOT NULL
);

CREATE TABLE card (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(200) NOT NULL DEFAULT 'New Card',
    status_id INTEGER NOT NULL
);

ALTER TABLE ONLY status
    ADD CONSTRAINT fk_status_board_id FOREIGN KEY (board_id) REFERENCES board(id);
ALTER TABLE ONLY card
    ADD CONSTRAINT fk_card_status_id FOREIGN KEY (status_id) REFERENCES  status(id);


INSERT INTO board (id, title) VALUES (1, 'Board 1');
INSERT INTO board (id, title) VALUES (2, 'Board 2');
INSERT INTO board (id, title) VALUES (3, 'Board 3');
SELECT pg_catalog.setval('board_id_seq', 3, true);

INSERT INTO status (id, title, board_id) VALUES (1, 'New', 1);
INSERT INTO status (id, title, board_id) VALUES (2, 'In progress', 1);
INSERT INTO status (id, title, board_id) VALUES (3, 'Testing', 1);
INSERT INTO status (id, title, board_id) VALUES (4, 'Done', 1);
INSERT INTO status (id, title, board_id) VALUES (5, 'New', 2);
INSERT INTO status (id, title, board_id) VALUES (6, 'In progress', 2);
INSERT INTO status (id, title, board_id) VALUES (7, 'Testing', 2);
INSERT INTO status (id, title, board_id) VALUES (8, 'Done', 2);
INSERT INTO status (id, title, board_id) VALUES (9, 'New', 3);
INSERT INTO status (id, title, board_id) VALUES (11, 'In progress', 3);
INSERT INTO status (id, title, board_id) VALUES (12, 'Testing', 3);
INSERT INTO status (id, title, board_id) VALUES (13, 'Done', 3);
SELECT pg_catalog.setval('status_id_seq', 13, true);


INSERT INTO card (id, title, status_id) VALUES (1, 'Card 1', 1);
INSERT INTO card (id, title, status_id) VALUES (2, 'Card 2', 1);
INSERT INTO card (id, title, status_id) VALUES (3, 'Card 3', 1);
INSERT INTO card (id, title, status_id) VALUES (4, 'Card 4', 2);
INSERT INTO card (id, title, status_id) VALUES (5, 'Card 5', 9);
INSERT INTO card (id, title, status_id) VALUES (6, 'Card 6', 11);
SELECT pg_catalog.setval('card_id_seq', 6, true);
