import db_common


def get_boards_with_content():
    boards = db_common.get_all_from_table('board')
    for board in boards:
        board['statuses'] = db_common.get_all_from_table_by_outer_table_id('status', 'board_id', str(board['id']))
        for status in board['statuses']:
            status['cards'] = db_common.get_all_from_table_by_outer_table_id('card', 'status_id', str(status['id']))
    return boards


def create_new_board():
    return db_common.create_new_board()
