from flask import Flask, jsonify, Blueprint
from flask_cors import CORS
from models import Persona, db

persona_bp = Blueprint('persona_bp', __name__)
CORS(persona_bp)

@persona_bp.route('/get_persona_by_rut/<string:rut>', methods=['GET'])
def get_persona_by_rut(rut):
    try:
        persona = Persona.query.filter_by(rut=rut).first()
        if persona:
            # Devuelve los datos de la persona
            return jsonify({
                "id": persona.id,
                "nombre": persona.nombre,
                "rut": persona.rut,
                "email": persona.email,
                "estado": persona.estado,
                "id_perfil": persona.id_perfil,
                "id_unidad": persona.id_unidad
                # Agrega más campos según sea necesario
            })
        else:
            # Si no se encuentra la persona, devuelve un mensaje de error
            return jsonify({"error": "Persona no encontrada"}), 404
    except Exception as e:
        # En caso de error, devuelve un mensaje de error con detalles
        return jsonify({"error": "Error al obtener la persona", "details": str(e)}), 500

