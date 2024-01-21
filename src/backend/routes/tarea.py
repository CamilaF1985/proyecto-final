from flask import jsonify, Blueprint, request
from models import Tarea, db
from flask_cors import CORS

create_tarea_bp = Blueprint('create_tarea', __name__)

@create_tarea_bp.route('/create_tarea', methods=['POST'])
def create_tarea():
    data = request.json 
    id_unidad = data.get('id_unidad')
    nombre = data.get('nombre')

    if not(id_unidad and nombre):
        return jsonify({"error": "El id de la unidad y nombre es requerido"}), 400     

    nueva_tarea = Tarea(id_unidad=id_unidad, nombre=nombre)

    try:
        db.session.add(nueva_tarea)
        db.session.commit()
        return jsonify({"message": "Unidad creada exitosamente", "id": nueva_tarea.nombre}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear la unidad", "details": str(e)}), 500   


delete_tarea_por_unidad_bp = Blueprint('delete_tarea_por_unidad', __name__)
CORS(delete_tarea_por_unidad_bp)

@delete_tarea_por_unidad_bp.route('/delete_tarea_por_unidad/<int:id>', methods=['DELETE'])
def delete_tarea_por_unidad(id):
    try:
        tarea = Tarea.query.filter_by(id=id).first()
        if tarea:
            db.session.delete(tarea)
            db.session.commit()
            return jsonify({"message": "Tarea eliminada correctamente"})
        else:
            return jsonify({"error": "Tarea no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": "Error al eliminar Tarea", "details": str(e)}), 500

get_tarea_by_unidad_bp = Blueprint('get_tarea_by_unidad', __name__)
CORS(get_tarea_by_unidad_bp)
@get_tarea_by_unidad_bp.route('/get_tarea_by_unidad/<string:id>', methods=['GET'])
def get_tarea_by_unidad(id):
    tareas = Tarea.query.filter_by(id_unidad=id).all()
    if tareas:
        resultados = []
        for tarea in tareas:
            resultados.append({
                "id": tarea.id,
                "id_unidad": tarea.id_unidad,
                "nombre": tarea.nombre,
                # Agrega más campos según sea necesario
            })
        return jsonify(resultados)
    else:
        return jsonify({"error": "No se encontraron tareas para el ID de unidad especificado"}), 404
    
# Blueprint para traer detalles de una tarea por su nombre
get_tarea_by_name_bp = Blueprint('get_tarea_by_name', __name__)
CORS(get_tarea_by_name_bp)

@get_tarea_by_name_bp.route('/get_tarea_by_name/<string:nombre>', methods=['GET'])
def get_tarea_by_name(nombre):
    tarea = Tarea.query.filter_by(nombre=nombre).first()

    if tarea:
        return jsonify({
            "id": tarea.id,
            "id_unidad": tarea.id_unidad,
            "nombre": tarea.nombre,
            # Agrega más campos según sea necesario
        })
    else:
        return jsonify({"error": "No se encontró la tarea con el nombre especificado"}), 404
  
    


 