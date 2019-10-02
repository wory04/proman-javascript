ALTER TABLE IF EXISTS ONLY public.status DROP CONSTRAINT IF EXISTS fk_status_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS fk_card_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.board DROP CONSTRAINT IF EXISTS fk_board_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.status DROP CONSTRAINT IF EXISTS fk_status_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS fk_card_info_user_id CASCADE;

DROP TABLE IF EXISTS public.board;
DROP SEQUENCE IF EXISTS public.board_id_seq;
DROP TABLE IF EXISTS public.status;
DROP SEQUENCE IF EXISTS public.status_id_seq;
DROP TABLE IF EXISTS public.card;
DROP SEQUENCE IF EXISTS public.card_id_seq;
DROP TABLE IF EXISTS public.user_info;
DROP SEQUENCE IF EXISTS public.user_info_id_seq;

CREATE TABLE board (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL DEFAULT 'New Board',
    user_id INTEGER
);

CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL DEFAULT 'New Status',
    board_id INTEGER NOT NULL,
    user_id INTEGER
);

CREATE TABLE card (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL DEFAULT 'New Card',
    status_id INTEGER NOT NULL,
    user_id INTEGER
);

CREATE TABLE user_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL
);

ALTER TABLE ONLY status
    ADD CONSTRAINT fk_status_board_id FOREIGN KEY (board_id) REFERENCES board(id);
ALTER TABLE ONLY card
    ADD CONSTRAINT fk_card_status_id FOREIGN KEY (status_id) REFERENCES  status(id);
ALTER TABLE ONLY board
    ADD CONSTRAINT fk_board_user_id FOREIGN KEY (user_id) REFERENCES  user_info(id);
ALTER TABLE ONLY status
    ADD CONSTRAINT fk_status_user_id FOREIGN KEY (user_id) REFERENCES  user_info(id);
ALTER TABLE ONLY card
    ADD CONSTRAINT fk_card_info_user_id FOREIGN KEY (user_id) REFERENCES  user_info(id);


INSERT INTO board (id, title) VALUES (1, 'Feature 1');
INSERT INTO board (id, title) VALUES (2, 'Feature 2');
INSERT INTO board (id, title) VALUES (3, 'Feature 3');
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
INSERT INTO status (id, title, board_id) VALUES (10, 'In progress', 3);
INSERT INTO status (id, title, board_id) VALUES (11, 'Testing', 3);
INSERT INTO status (id, title, board_id) VALUES (12, 'Done', 3);
INSERT INTO status (id, title, board_id) VALUES (13, 'Review', 3);
INSERT INTO status (id, title, board_id) VALUES (14, 'Release', 3);
SELECT pg_catalog.setval('status_id_seq', 14, true);


INSERT INTO card (id, title, status_id) VALUES (1, 'Task 1', 1);
INSERT INTO card (id, title, status_id) VALUES (2, 'Task 2', 1);
INSERT INTO card (id, title, status_id) VALUES (3, 'Task 3', 1);
INSERT INTO card (id, title, status_id) VALUES (4, 'Task 4', 2);
INSERT INTO card (id, title, status_id) VALUES (5, 'Task 5', 9);
INSERT INTO card (id, title, status_id) VALUES (6, 'Task 6', 10);
INSERT INTO card (id, title, status_id) VALUES (7, 'Task 7', 11);
INSERT INTO card (id, title, status_id) VALUES (8, 'Task 8', 12);
INSERT INTO card (id, title, status_id) VALUES (9, 'Task 9', 13);
INSERT INTO card (id, title, status_id) VALUES (10, 'Task 10', 14);
SELECT pg_catalog.setval('card_id_seq', 10, true);


INSERT INTO user_info (id, name, password) VALUES (1, 'admin1', '$2b$12$RPCk9T6rpCEgkV8NiocthuHiNkFUp.4FJutWxoPXpbBDXUXeAJysW');
SELECT pg_catalog.setval('user_info_id_seq', 1, true);
