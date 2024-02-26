from functools import wraps
from flask import jsonify
from psycopg2 import OperationalError
from models import db

def verifica_conexion_db(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Intenta realizar una operación que requiera la conexión a la base de datos
            db.engine.execute("SELECT 1")
            # Si se llega a este punto, la conexión se ha establecido con éxito
            return f(*args, **kwargs)
        except OperationalError as e:
            # En caso de que ocurra un error de conexión a la base de datos, maneja la excepción aquí
            mensaje_error = 'Error de conexión a la base de datos: {}'.format(e)
            return jsonify({'error': mensaje_error}), 500
    return decorated_function
