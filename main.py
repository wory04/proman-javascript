from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards_with_content()


@app.route('/card', methods=['POST'])
@json_response
def add_new_card():
    new_card_status = request.get_json()['statusId']

    new_card = data_handler.create_new_card(new_card_status)

    return new_card


@app.route('/status', methods=['POST'])
@json_response
def create_status():
    new_status_board = request.get_json()['boardId']
    return data_handler.create_new_status(new_status_board)


@app.route('/board', methods=['POST'])
@json_response
def create_board():
    return data_handler.create_new_board()


@app.route('/board/<id>', methods=['PATCH'])
@json_response
def rename_board(id):
    board_data = request.get_json()
    return data_handler.rename_board(board_data)


@app.route('/status/<id>', methods=['PATCH'])
@json_response
def rename_status(id):
    status_data = request.get_json()
    return data_handler.rename_status(status_data)


@app.route('/card/move', methods=['PATCH'])
def card_move():
    moved_card = request.get_json()
    return data_handler.move_card(moved_card)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
