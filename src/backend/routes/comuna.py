from flask import jsonify, Blueprint, request
from models import Comuna, db
from flask_jwt_extended import JWTManager, jwt_required
 
get_all_comuna_bp = Blueprint('get_all_comuna', __name__)

@get_all_comuna_bp.route('/get_all_comuna_bp', methods=['GET'])
##@jwt_required()
def get_all_comuna():
    try:
        comunas = Comuna.query.order_by(Comuna.id).all()
        comunas_list = [{"id": comuna.id, "nombre": comuna.nombre} for comuna in comunas]  
        response_body = {
            "msg": "Listado de comunas",
            "regiones": comunas_list
        }
        return jsonify(response_body), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
