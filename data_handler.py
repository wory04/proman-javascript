import db_common


def get_boards_with_content():
    boards = db_common.get_all_from_table('board')
    for board in boards:
        board['statuses'] = db_common.get_all_from_table_by_outer_table_id('status', 'board_id', str(board['id']))
        for status in board['statuses']:
            status['cards'] = db_common.get_all_from_table_by_outer_table_id('card', 'status_id', str(status['id']))
    return boards


def create_new_card(card_status):
    card_table = 'card'
    card_status_column = 'status_id'

    return db_common.insert_into_inner_table(card_table, card_status_column, card_status)


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


def rename_card(card_data):
    card_id = card_data['id']
    card_title = card_data['title']
    return db_common.update_title_by_id(card_id, card_title, 'card')


def delete_card(card_data):
    card_id = card_data['id']
    return db_common.delete_card_by_id(card_id)
