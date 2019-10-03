import db_connection
from psycopg2 import sql


@db_connection.connection_handler
def get_all_from_table(cursor, table):
    query_for_func = sql.SQL('SELECT * FROM {} ORDER BY id ASC').format(
        sql.Identifier(table))
    cursor.execute(query_for_func)

    all_from_table = cursor.fetchall()

    return all_from_table


@db_connection.connection_handler
def get_all_from_table_by_outer_table_id(cursor, table, id_type, id_value):
    query_for_all_from_inner_by_outer_table = sql.SQL('''
        SELECT * FROM {} WHERE {} = {} ORDER BY id ASC;
        ''').format(
        sql.Identifier(table),
        sql.Identifier(id_type),
        sql.SQL(id_value),
    )
    cursor.execute(query_for_all_from_inner_by_outer_table)
    result = cursor.fetchall()

    return result


@db_connection.connection_handler
def insert_into_inner_table(cursor, table, id_type, id_value):
    query_to_insert_into_inner_table = sql.SQL('''
    INSERT INTO {} ({}) VALUES ({}) RETURNING *
    ''').format(
        sql.Identifier(table),
        sql.Identifier(id_type),
        sql.SQL(id_value)
    )
    cursor.execute(query_to_insert_into_inner_table)
    result = cursor.fetchone()

    return result


@db_connection.connection_handler
def create_new_board(cursor):
    cursor.execute(
        sql.SQL("""
                    INSERT INTO board
                    DEFAULT VALUES 
                    RETURNING *;
                    """))
    result = cursor.fetchone()

    return result


@db_connection.connection_handler
def update_title_by_id(cursor, id_number, title, table):
    cursor.execute(sql.SQL('''
                   UPDATE {table}
                      SET title = %(title)s
                    WHERE id = %(id)s
                RETURNING *;
            ''').format(table=sql.Identifier(table)), {'title': title, 'id': id_number})

    result = cursor.fetchone()
    return result


@db_connection.connection_handler
def update_card(cursor, status_id, card_id, card_position):
    cursor.execute(
        sql.SQL(
            """
            UPDATE card
            SET status_id = %(status_id)s, position = %(card_position)s
            WHERE id = %(card_id)s
            RETURNING *;
            """
        ), {'status_id': status_id, 'card_position': card_position, 'card_id': card_id})
    result = cursor.fetchone()
    return result


@db_connection.connection_handler
def insert_into_card_table(cursor, status_id, card_position):
    cursor.execute(
        sql.SQL(
            """
            INSERT INTO card (status_id, position)
            VALUES (%s, %s)
            RETURNING *;
            """
        ), [status_id, card_position]
    )
    result = cursor.fetchone()
    return result


@db_connection.connection_handler
def update_cards_position(cursor, card_id, shift_number):
    cursor.execute(
        sql.SQL(
            """
            Update card
            set position = position + %(shift_number)s 
            where id = %(card_id)s;
            """
        ), {'card_id': card_id, "shift_number": shift_number}
    )


@db_connection.connection_handler
def get_cards_to_modify_position(cursor, card_id, old_status_id):
    cursor.execute(
        sql.SQL(
            """
            SELECT id
            FROM card
            WHERE status_id = %(old_status_id)s 
            AND position > (SELECT position
                            FROM card
                            WHERE id = %(card_id)s);                   
            """
        ), {"card_id": card_id, "old_status_id": old_status_id}
    )
    result = cursor.fetchall()
    return result


@db_connection.connection_handler
def get_old_status_id(cursor, card_id):
    cursor.execute(
        sql.SQL(
            """
            SELECT status_id
            FROM card
            WHERE id = %(card_id)s;
            """
        ), {"card_id": card_id}
    )
    result = cursor.fetchone()
    return result
