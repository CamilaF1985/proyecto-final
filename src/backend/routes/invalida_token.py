from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, unset_jwt_cookies, get_jwt_identity

elimina_token_bp = Blueprint('elimina_token', __name__)

@elimina_token_bp.route('/elimina_token', methods=['POST'])
@jwt_required()
def logout():
    # Obtiene la identidad del usuario del token
    current_user = get_jwt_identity()

    # Imprimir en la consola para verificar lo que está sucediendo
    print(f"Usuario {current_user} ha solicitado cerrar sesión.")

    # Crea un nuevo token con un tiempo de expiración muy corto (por ejemplo, 1 segundo)
    new_token = create_access_token(identity=current_user, expires_delta=False)

    # Elimina el token actual del cliente
    resp = jsonify({"message": "Logged out", "new_token": new_token})
    unset_jwt_cookies(resp)

    # Imprimir en la consola para verificar lo que está sucediendo
    print(f"Sesión cerrada para el usuario {current_user}.")

    return resp, 200

 