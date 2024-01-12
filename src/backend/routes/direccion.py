from flask import jsonify, Blueprint, request
from models import Direccion, db
 
create_direccion_bp = Blueprint('create_direccion', __name__)

@create_direccion_bp.route('/create_direccion', methods=['POST'])
def create_direccion():
    
    data = request.json 

    required_fields = ["id_pais", "id_region", "id_comuna", "calle", "numero", "depto_casa", "id_unidad"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"El campo {field} es requerido"}), 400

    nueva_direccion = Direccion(
        id_pais=data.get("id_pais"),
        id_region=data.get("id_region"),
        id_comuna=data.get("id_comuna"),
        calle=data.get("calle"),
        numero=data.get("numero"),
        depto_casa=data.get("depto_casa"),
        id_unidad=data.get("id_unidad")
    )

    try:
        db.session.add(nueva_direccion)
        db.session.commit()
        return jsonify({"message": "Dirección creada exitosamente", "id": nueva_direccion.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear la dirección", "details": str(e)}), 500

