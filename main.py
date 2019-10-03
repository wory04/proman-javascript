from flask import Flask, render_template, url_for, request, session, jsonify, make_response
from util import json_response
from flask_socketio import SocketIO

import data_handler

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.debug = True

socket = SocketIO(app)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    username = session.get('username')
    user_id = data_handler.get_user_id(username)['id'] if username else None
    return render_template('index.html', username=username, user_id=user_id)


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
    new_card_position = request.get_json()['position']

    new_card = data_handler.create_new_card(new_card_status, new_card_position)

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


@app.route('/private-board', methods=['POST'])
@json_response
def create_private_board():
    username = session.get('username')
    user_id = data_handler.get_user_id(username)['id']
    return data_handler.create_new_board(user_id)


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


@app.route('/card/<id>', methods=['PATCH', 'DELETE'])
@json_response
def manipulate_card(id):
    if request.method == 'PATCH':
        card_data = request.get_json()
        return data_handler.rename_card(card_data)
    elif request.method == 'DELETE':
        return data_handler.delete_card(id)


@app.route('/board/<id>/status', methods=['POST'])
@json_response
def check_number_of_statuses_by_board_id(id):
    data = request.get_json()
    return data_handler.is_full('board_id', data)


@app.route('/status/<id>/card', methods=['POST'])
@json_response
def check_number_of_statuses_by_status_id(id):
    data = request.get_json()
    return data_handler.is_full('status_id', data)


@app.route('/card/move', methods=['PATCH'])
def card_move():
    moved_card = request.get_json()
    return data_handler.move_card(moved_card)


@app.route('/cards/move', methods=['PATCH'])
def cards_move():
    moved_cards = request.get_json()
    return data_handler.move_cards(moved_cards)


@app.route('/registration', methods=['POST'])
def route_registration():
    user_data = request.get_json()
    new_user = data_handler.new_registration(user_data)

    if new_user:
        response = {'id': new_user['id'], 'name': new_user['name'], 'message': "Successful registration!"}
        return make_response(jsonify(response), 201)
    else:
        return make_response(jsonify({"message": "This username is already taken! Please choose another one!"}), 406)


@app.route('/login', methods=['POST'])
def route_login():
    user_data = request.get_json()

    if data_handler.validate_login(user_data):
        session['username'] = user_data['username']
        response = {"message": "You are logged in!"}
        return make_response(jsonify(response), 200)

    response = {"message": "Login failed! Invalid credentials!"}
    return make_response(jsonify(response), 401)


@app.route('/logout', methods=['POST'])
def route_logout():
    session.pop('username')
    response = {"message": "You successfully logged out!"}
    return make_response(jsonify(response), 200)


@app.route('/call_socket')
def call_socket():
    socket.emit('data-changed', {'id': 2, 'x': 120, 'y': 350})
    return '', 204


@socket.on('drag_data')
def on_drag_card(data):
    socket.emit('data-changed', data, include_self=False)


@socket.on('drag_end')
def on_drag_end_card():
    socket.emit('drag_end', include_self=False)


@socket.on('drop')
def on_drop_card(data):
    socket.emit('drop', data, include_self=False)


def main():
    socket.run(app)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
