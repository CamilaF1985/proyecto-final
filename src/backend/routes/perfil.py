from flask import Blueprint, jsonify
from models import Perfil

get_all_perfil_bp = Blueprint('get_all_perfil', __name__)

@get_all_perfil_bp.route('/get_all_perfil', methods=['GET'])
def get_all_perfil():
    try:
        perfiles = Perfil.query.all()
        perfil_list = [{"id": perfil.id, "nombre": perfil.nombre} for perfil in perfiles]
        response_body = {
            "msg": "Hello, this is your GET /perfiles response",
            "perfil": perfil_list
        }
        return jsonify(response_body), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500