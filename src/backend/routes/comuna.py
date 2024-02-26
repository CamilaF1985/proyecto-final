from flask import jsonify, Blueprint, request 
from models import Comuna, Region, db
from flask_jwt_extended import JWTManager, jwt_required
from sqlalchemy import collate

from decorador import database_required

get_all_comuna_bp = Blueprint('get_all_comuna', __name__)

@get_all_comuna_bp.route('/get_all_comuna_bp', methods=['GET'])
#@database_required
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

@get_all_comuna_bp.route('/get_comunas_by_region/<int:id_region>', methods=['GET'])
def get_comunas_by_region(id_region):
    try:
      comunas = Comuna.query.filter_by(id_region=id_region).order_by(Comuna.nombre).all()
      comunas_list = [{"nombre": comuna.nombre ,"id": comuna.id } for comuna in comunas]
      response_body = {
      "msg": f"Listado de comunas para la región {id_region}",
      "comunas": comunas_list
      }
      return jsonify(response_body), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500