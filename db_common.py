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
def delete_card_by_id(cursor, card_id):
    cursor.execute(sql.SQL('''
                    DELETE FROM card
                    WHERE id = %(card_id)s
                    RETURNING *
                    '''), {'card_id': card_id})

    result = cursor.fetchone()
    return result


@db_connection.connection_handler
def check_entity_is_full(cursor, column, counter, entity):
    cursor.execute(sql.SQL('''
                    SELECT  CASE
                                WHEN COUNT({column}) < 8 THEN FALSE
                                ELSE TRUE
                            END AS count
                    FROM {entity}
                    WHERE {column} = %(counter)s;
                    ''').format(column=sql.Identifier(column), entity=sql.Identifier(entity)), {'counter': counter})

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


@db_connection.connection_handler
def save_new_registration(cursor, user_data):
    insert_data = sql.SQL('''
        INSERT INTO user_info (name, password) VALUES ({})
        RETURNING *;
        ''').format(
        sql.SQL(', ').join(sql.Placeholder() * len(user_data)))

    cursor.execute(insert_data, user_data)
    new_user = cursor.fetchone()

    return new_user


@db_connection.connection_handler
def get_password_by_username(cursor, username):
    query_for_pwd = sql.SQL("SELECT password FROM user_info WHERE name = {}").format(sql.Placeholder())
    cursor.execute(query_for_pwd, [username])
    password = cursor.fetchone()

    return password


@db_connection.connection_handler
def get_all_users(cursor):
    query_for_users = sql.SQL("SELECT name FROM user_info")
    cursor.execute(query_for_users)
    user_names = cursor.fetchall()

    return user_names
