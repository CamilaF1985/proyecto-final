from flask import Flask, jsonify, Blueprint, request
from flask_cors import CORS
from models import TareaPersona, db

create_tarea_persona_bp = Blueprint('create_tarea_persona', __name__)
CORS(create_tarea_persona_bp)


@create_tarea_persona_bp.route('/create_tarea_persona', methods=['POST'])
def create_tarea_persona():
     
    data = request.json 
    id_tarea = data.get("id_tarea")
    id_unidad = data.get('id_unidad')
    id_persona = data.get('id_persona')
    fecha_inicio = data.get('fecha_inicio')
    fecha_termino = data.get('fecha_termino')

    if not( id_unidad and id_persona and fecha_inicio and fecha_termino ):
        return jsonify({"error": "El id de la unidad id_persona fecha de inicio y termino son requerido"}), 400     

    nueva_tarea_persona = TareaPersona(id_tarea= id_tarea,
                                       id_unidad = id_unidad,                                       
                                       id_persona=id_persona,
                                       fecha_inicio=fecha_inicio,
                                       fecha_termino= fecha_termino
                                      )
    try:
        db.session.add(nueva_tarea_persona)
        db.session.commit()
        return jsonify({"message": "tarea asignada a perosna exitosamente", "id": nueva_tarea_persona.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al asignar tarea a persona", "details": str(e)}), 500    