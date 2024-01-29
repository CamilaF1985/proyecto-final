from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from datetime import timedelta
import json

elimina_token_bp = Blueprint('elimina_token', __name__)

# Variable para almacenar el estado de renovación del token
token_renewed = {}

@elimina_token_bp.route('/elimina_token', methods=['POST', 'OPTIONS'])
@jwt_required(optional=True)
def logout():
    # Si es una solicitud OPTIONS, simplemente responde sin verificar el token
    if request.method == 'OPTIONS':
        response = current_app.response_class(
            response=json.dumps({}),
            status=200,
            mimetype='application/json'
        )
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response

    # Si es una solicitud POST, entonces verifica el token y realiza las acciones necesarias
    current_user = get_jwt_identity()
    
    # Verificar si el token ha sido renovado previamente
    if token_renewed.get(current_user):
        return jsonify({"message": "Token already renewed"}), 400

    print(f"Usuario {current_user} ha solicitado cerrar sesión.")
    
    # Crear un nuevo token de acceso
    new_token = create_access_token(identity=current_user, expires_delta=timedelta(minutes=3))
    print(f"Sesión extendida para el usuario {current_user}.")

    # Crear un nuevo token de actualización
    new_refresh_token = create_refresh_token(identity=current_user)

    # Marcar el token como renovado para este usuario
    token_renewed[current_user] = True

    return jsonify({"message": "Token renewed", "new_token": new_token, "new_refresh_token": new_refresh_token}), 200

 