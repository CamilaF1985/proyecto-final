from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import Persona
from werkzeug.security import check_password_hash
from rut_chile import rut_chile

get_auth_bp = Blueprint('auth', __name__)
@get_auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    rut = data.get('rut')
    password = data.get('contrasena')

    if not rut or not password:
        return jsonify({"msg": "Falta el rut o la contraseña"}), 400

    #validar rut https://pypi.org/project/rut-chile/
    if not(rut_chile.is_valid_rut(rut)):
       return jsonify({"error": "rut no valido"}), 400

    # Buscar al usuario en la base de datos por su rut
    user = Persona.query.filter_by(rut=rut[:-2]).first()

    if user and check_password_hash(user.contrasena, password):
        # El usuario existe y la contraseña coincide, crear un token JWT
        access_token = create_access_token(identity=user.id)
        # Devolver los campos email, nombre y token en la respuesta
        return jsonify({
            "id": user.id,
            "email": user.email,
            "nombre": user.nombre,
            "token": access_token
        }), 200
    else:
        return jsonify({"msg": "Credenciales inválidas"}), 401
