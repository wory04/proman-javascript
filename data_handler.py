import db_common


def get_boards_with_content():
    boards = db_common.get_all_from_table('board')
    for board in boards:
        board['statuses'] = db_common.get_all_from_table_by_outer_table_id('status', 'board_id', str(board['id']))
        for status in board['statuses']:
            status['cards'] = db_common.get_all_from_table_by_outer_table_id('card', 'status_id', str(status['id']))
    return boards


def create_new_card(card_status, card_position):
    return db_common.insert_into_card_table(int(card_status), int(card_position))


def create_new_status(status_board):
    status_table = 'status'
    status_board_column = 'board_id'

    return db_common.insert_into_inner_table(status_table, status_board_column, status_board)


def create_new_board():
    return db_common.create_new_board()


def rename_board(board_data):
    board_title = board_data['title']
    board_id = board_data['id']
    return db_common.update_title_by_id(board_id, board_title, 'board')


def rename_status(status_data):
    status_id = status_data['id']
    status_title = status_data['title']
    return db_common.update_title_by_id(status_id, status_title, 'status')


def move_card(moved_card):
    status_id = moved_card['statusId']
    card_id = moved_card['cardId']
    card_position = moved_card['position']
    old_status = db_common.get_old_status_id(card_id)
    cards_to_modify = db_common.get_cards_to_modify_position(card_id, old_status['status_id'])
    data = db_common.update_card(status_id, card_id, card_position)
    if cards_to_modify:
        for card in cards_to_modify:
            db_common.update_cards_position(card['id'], -1)
    return data


def move_cards(moved_cards):
    new_card_index = moved_cards['newCard']
    card_ids = moved_cards['cards']
    cards_to_update = card_ids[int(new_card_index) + 1:]
    if cards_to_update:
        for card_id in cards_to_update:
            db_common.update_cards_position(card_id, 1)
    return {}
