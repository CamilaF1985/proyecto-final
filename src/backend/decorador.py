from functools import wraps
from flask import abort, current_app, request, jsonify


def database_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(current_app, 'database'):
            abort(500, "Database connection not available")
        return f(*args, **kwargs)
    return decorated_function


def handle_preflight(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            response = jsonify({"message": "Preflight request received"})
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS") 
            response.headers.add("Access-Control-Allow-Headers", "Content-Type")
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            response.headers.add("Access-Control-Allow-Credentials", "true")
            return response
        elif request.method == 'POST':
            try:
                data = request.get_json()  # Obtener datos en formato JSON desde el front-end
                print("filrto options OK")
                return f(*args, **kwargs)  # Llamar a la función original con los mismos argumentos
            except Exception as e:
                return jsonify({"error": "Error al procesar los datos JSON"}), 400
    return decorated_function