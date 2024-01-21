from flask import Flask, jsonify, Blueprint, request
from flask_cors import CORS
from models import TareaPersona, db, Tarea

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

    if not (id_unidad and id_persona and fecha_inicio):
        return jsonify({"error": "El id de la unidad, id_persona, fecha de inicio son requeridos"}), 400     

    # Verificar si ya existe un registro con la misma combinación única
    if TareaPersona.query.filter_by(id_unidad=id_unidad, id_persona=id_persona, id_tarea=id_tarea).first() is not None:
        return jsonify({"error": "Ya existe una tarea asignada a la persona con la misma combinación de id_unidad, id_persona e id_tarea"}), 400

    nueva_tarea_persona = TareaPersona(
        id_tarea=id_tarea,
        id_unidad=id_unidad,                                       
        id_persona=id_persona,
        fecha_inicio=fecha_inicio,
        fecha_termino=fecha_termino
    )

    try:
        db.session.add(nueva_tarea_persona)
        db.session.commit()
        return jsonify({"message": "Tarea asignada a persona exitosamente", "id": nueva_tarea_persona.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al asignar tarea a persona", "details": str(e)}), 500
    
@create_tarea_persona_bp.route('/update_tarea_persona/<int:tarea_persona_id>', methods=['PUT'])
def update_tarea_persona(tarea_persona_id):
    data = request.json
    fecha_termino_nueva = data.get('fecha_termino')

    if fecha_termino_nueva is None:
        return jsonify({"error": "La fecha de termino es requerida para la actualización"}), 400

    tarea_persona = TareaPersona.query.get(tarea_persona_id)

    if tarea_persona is None:
        return jsonify({"error": "No se encontró la tarea_persona con el ID proporcionado"}), 404

    tarea_persona.fecha_termino = fecha_termino_nueva

    try:
        db.session.commit()
        return jsonify({"message": "Fecha de termino actualizada exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar la fecha de termino", "details": str(e)}), 500    
    
@create_tarea_persona_bp.route('/tarea_persona_by_id_persona/<int:id_persona>', methods=['GET'])
def get_tarea_persona_by_id_persona(id_persona):
    tarea_persona_list = db.session.query(
        TareaPersona.id.label('id_tarea_persona'),
        TareaPersona.id_tarea,
        TareaPersona.id_unidad,
        TareaPersona.id_persona,
        TareaPersona.fecha_inicio,
        TareaPersona.fecha_termino,
        Tarea.nombre.label('nombre_tarea')
    ).join(Tarea, Tarea.id == TareaPersona.id_tarea).filter(TareaPersona.id_persona == id_persona).all()

    tarea_persona_data = []

    for tarea_persona in tarea_persona_list:
        tarea_persona_data.append({
            "id_tarea_persona": tarea_persona.id_tarea_persona,
            "id_tarea": tarea_persona.id_tarea,
            "id_unidad": tarea_persona.id_unidad,
            "id_persona": tarea_persona.id_persona,
            "fecha_inicio": tarea_persona.fecha_inicio,
            "fecha_termino": tarea_persona.fecha_termino,
            "nombre_tarea": tarea_persona.nombre_tarea if tarea_persona.nombre_tarea else None,
        })

    # Devuelve un array vacío si no hay tareas asignadas para este usuario
    return jsonify({"tarea_persona_list": tarea_persona_data}) if tarea_persona_data else jsonify({"tarea_persona_list": []}), 200

delete_tarea_persona_bp = Blueprint('delete_tarea_persona', __name__)
CORS(delete_tarea_persona_bp)

@delete_tarea_persona_bp.route('/delete_tarea_persona/<int:id>', methods=['DELETE'])
def delete_tarea_persona(id):
    tarea_persona = TareaPersona.query.get(id)

    if tarea_persona is None:
        return jsonify({"error": "No se encontró la tarea_persona con el ID proporcionado"}), 404

    try:
        db.session.delete(tarea_persona)
        db.session.commit()
        return jsonify({"message": "Tarea_persona eliminada exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar la tarea_persona", "details": str(e)}), 500
