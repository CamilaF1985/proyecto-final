from flask import Flask, jsonify, Blueprint, request
from flask_jwt_extended import JWTManager, jwt_required
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



get_person_by_unidad_bp = Blueprint('get_person_by_unidad_bp', __name__)
CORS(get_person_by_unidad_bp)

@get_person_by_unidad_bp.route('/get_person_by_unidad/<string:id>', methods=['GET'])
def get_person_by_unidad(id):
    personas =  Persona.query.filter_by(id_unidad=id).all()
    if personas:
        resultados = []
        for persona in personas:
            resultados.append({
                "id": persona.id,
                "nombre": persona.nombre,
                "rut": persona.rut,
                "email": persona.email,
                "estado": persona.estado,
                "id_perfil": persona.id_perfil,
                "id_unidad": persona.id_unidad
                # Agrega más campos según sea necesario
            })
        return jsonify(resultados)
    else:
        return jsonify({"error": "No se encontraron personas para el ID de unidad especificado"}), 404



update_email_persona_bp = Blueprint('update_email_persona', __name__)
CORS(update_email_persona_bp)

@update_email_persona_bp.route('/update_email_persona/<int:id>', methods=['PUT'])
def update_email_persona(id):
    data = request.json
    new_email = data.get('email')

    if not new_email:
        return jsonify({"error": "El nuevo correo es requerido"}), 400

    persona = Persona.query.get(id)
    if persona:
        persona.email = new_email
        try:
            db.session.commit()
            return jsonify({"message": "Correo de la persona actualizado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Error al actualizar el correo de la persona", "details": str(e)}), 500
    else:
        return jsonify({"error": "No se encontró la persona con el ID especificado"}), 404
