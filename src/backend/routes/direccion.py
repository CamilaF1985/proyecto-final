from flask import jsonify, Blueprint, request
from models import Direccion, db

create_direccion_bp = Blueprint('create_direccion', __name__)

@create_direccion_bp.route('/create_direccion', methods=['POST'])
def create_direccion():
    data = request.json 

    required_fields = ["id_pais", "id_region", "id_comuna", "calle", "id_unidad"]

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


direccion_bp = Blueprint('direccion', __name__)

@direccion_bp.route('/direccion/<int:id_unidad>', methods=['GET'])
def get_direccion_by_unidad(id_unidad):
    try:
        direccion = Direccion.query.filter_by(id_unidad=id_unidad).first()

        if direccion:
            return jsonify({
                "id": direccion.id,
                "id_pais": direccion.id_pais,
                "id_region": direccion.id_region,
                "id_comuna": direccion.id_comuna,
                "calle": direccion.calle,
                "numero": direccion.numero,
                "depto_casa": direccion.depto_casa,
                "id_unidad": direccion.id_unidad
            }), 200
        else:
            return jsonify({"error": "No se encontró la dirección para la unidad especificada"}), 404

    except Exception as e:
        return jsonify({"error": "Error al obtener la dirección", "details": str(e)}), 500


editar_direccion_bp = Blueprint('editar_direccion', __name__)

@editar_direccion_bp.route('/direccion/<int:id_direccion>', methods=['PUT'])
def editar_direccion(id_direccion):
    try:
        direccion = Direccion.query.get(id_direccion)

        if not direccion:
            return jsonify({"error": "No se encontró la dirección especificada"}), 404

        data = request.json

        # Actualizar los campos que se proporcionan en la solicitud JSON
        for key, value in data.items():
            setattr(direccion, key, value)

        db.session.commit()

        return jsonify({"message": "Dirección actualizada exitosamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar la dirección", "details": str(e)}), 500
