from flask import Blueprint, jsonify
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, unset_jwt_cookies


elimina_token_bp = Blueprint('elimina_token', __name__)

@elimina_token_bp.route('/elimina_token', methods=['POST'])
@jwt_required()
def logout():
    # Obtiene la identidad del usuario del token
    current_user = get_jwt_identity()
    # Crea un nuevo token con un tiempo de expiración muy corto (por ejemplo, 1 segundo)
    new_token = create_access_token(identity=current_user, expires_delta=False)
    return jsonify({"message": "Logged out", "new_token": new_token}), 200
 