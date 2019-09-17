import db_connection
from psycopg2 import sql


@db_connection.connection_handler
def get_all_from_table(cursor, table):
    query_for_func = sql.SQL('SELECT * FROM {}').format(
                     sql.Identifier(table))
    cursor.execute(query_for_func)

    all_from_table = cursor.fetchall()

    return all_from_table
