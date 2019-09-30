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
def update_card(cursor, status_id, card_id):
    cursor.execute(
        sql.SQL(
            """
            UPDATE card
            SET status_id = %(status_id)s
            WHERE id = %(card_id)s
            RETURNING *;
            """
        ), {'status_id': status_id, 'card_id': card_id})
    result = cursor.fetchone()
    return result
