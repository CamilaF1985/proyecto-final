from flask import jsonify, Blueprint, request
from models import Tarea, db
 
create_tarea_bp = Blueprint('create_tarea', __name__)

@create_tarea_bp.route('/create_tarea', methods=['POST'])
def create_tarea():
     
    data = request.json 
    id_unidad = data.get('id_unidad')
    nombre= data.get('nombre')

    if not(id_unidad and nombre):
        return jsonify({"error": "El id de la unidad y nombre es requerido"}), 400     

    nueva_tarea = Tarea(id_unidad = id_unidad,
                        nombre = nombre
                    )
    try:
        db.session.add(nueva_tarea)
        db.session.commit()
        return jsonify({"message": "Unidad creada exitosamente", "id": nueva_tarea.nombre}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear la unidad", "details": str(e)}), 500   
