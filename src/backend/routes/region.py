from flask import jsonify, Blueprint, request
from models import Region, db
from flask_jwt_extended import JWTManager, jwt_required
 
get_all_region_bp = Blueprint('get_all_region', __name__)

@get_all_region_bp.route('/get_all_region_bp', methods=['GET'])
##@jwt_required()
def get_all_region():
    try:
        regiones = Region.query.order_by(Region.id).all()
        regiones_list = [{"id": region.id, "nombre": region.nombre} for region in regiones]  
        response_body = {
            "msg": "Listado de regiones",
            "regiones": regiones_list
        }
        return jsonify(response_body), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
