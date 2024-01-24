from flask import jsonify, Blueprint, request
from models import GastoPersona, Gasto, db

create_gasto_persona_bp = Blueprint('create_gasto_persona', __name__)

@create_gasto_persona_bp.route('/create_gasto_persona', methods=['POST'])
def create_gasto_persona():
    # Obtener datos del cuerpo de la solicitud
    data = request.json
    id_persona = data.get('id_persona')
    id_gasto = data.get('id_gasto') 
    monto_prorrateado = data.get('monto_prorrateado')
    estado = data.get('estado', False)  # Por defecto, el estado es False si no se proporciona en la solicitud

    # Validar que se proporcionen los campos requeridos
    if not (id_persona and id_gasto and monto_prorrateado):
        return jsonify({"error": "El id de la unidad, id_gasto y monto_prorrateado son requeridos"}), 400

    # Crear una nueva instancia de GastoPersona
    nuevo_gasto_persona = GastoPersona(
        id_persona=id_persona,
        id_gasto=id_gasto,
        monto_prorrateado=monto_prorrateado,
        estado=estado
    )

    try:
        # Agregar a la base de datos y confirmar la transacción
        db.session.add(nuevo_gasto_persona)
        db.session.commit()
        return jsonify({"message": "Gasto persona creado exitoso"}), 201
    except Exception as e:
        # En caso de error, hacer rollback y devolver un mensaje de error
        db.session.rollback()
        return jsonify({"mensaje": "Error al crear nuevo gasto", "details": str(e)}), 500

get_gasto_por_persona_bp = Blueprint('get_gasto_por_persona', __name__)

@get_gasto_por_persona_bp.route('/get_gasto_por_persona/<int:id_persona>', methods=['GET'])
def get_gasto_por_persona(id_persona):
    try:
        # Obtener todos los gastos relacionados con la persona
        gastos = GastoPersona.query.filter_by(id_persona=id_persona).all()

        # Crear una lista de datos de gastos
        gastos_data = []
        for gasto in gastos:
            gasto_info = {
                'id_persona': gasto.id_persona,
                'id_gasto': gasto.id_gasto,
                'monto_prorrateado': gasto.monto_prorrateado,
                'estado': gasto.estado
            }
            gastos_data.append(gasto_info)

        # Devolver la lista de datos de gastos
        return jsonify({"gastos": gastos_data}), 200

    except Exception as e:
        # En caso de error, devolver un mensaje de error
        return jsonify({"error": "Error al obtener los gastos de persona", "details": str(e)}), 500

get_gasto_persona_by_id_persona_bp = Blueprint('get_gasto_persona_by_id_persona', __name__)

@get_gasto_persona_by_id_persona_bp.route('/gasto_persona_by_id_persona/<int:id_persona>', methods=['GET'])
def get_gasto_persona_by_id_persona(id_persona):
    try:
        # Obtener los gastos relacionados con la persona, incluyendo la descripción del gasto
        gastos_persona = db.session.query(
            GastoPersona.id_persona,
            GastoPersona.id_gasto,
            GastoPersona.monto_prorrateado,
            GastoPersona.estado,
            Gasto.descripcion.label('descripcion_gasto')
        ).join(Gasto, Gasto.id == GastoPersona.id_gasto).filter(GastoPersona.id_persona == id_persona).all()

        # Crear una lista de datos de gastos de persona
        gastos_persona_data = []

        for gasto_persona in gastos_persona:
            gastos_persona_data.append({
                "id_persona": gasto_persona.id_persona,
                "id_gasto": gasto_persona.id_gasto,
                "monto_prorrateado": gasto_persona.monto_prorrateado,
                "estado": gasto_persona.estado,
                "descripcion_gasto": gasto_persona.descripcion_gasto if gasto_persona.descripcion_gasto else None,
            })

        # Devolver la lista de datos de gastos de persona
        return jsonify({"gastos_persona_list": gastos_persona_data}) if gastos_persona_data else jsonify({"gastos_persona_list": []}), 200

    except Exception as e:
        # En caso de error, devolver un mensaje de error
        return jsonify({"error": "Error al obtener los gastos de la persona", "details": str(e)}), 500

delete_gasto_persona_bp = Blueprint('delete_gasto_persona', __name__)

@delete_gasto_persona_bp.route('/delete_gasto_persona_by_gasto/<int:id_gasto>', methods=['DELETE'])
def delete_gasto_persona_by_gasto(id_gasto):
    gasto_persona = GastoPersona.query.filter_by(id_gasto=id_gasto).first()

    if gasto_persona is None:
        return jsonify({"error": "No se encontró el gasto_persona asociado al gasto con el ID proporcionado"}), 404

    try:
        db.session.delete(gasto_persona)
        db.session.commit()
        return jsonify({"message": "Gasto_persona eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar el gasto_persona", "details": str(e)}), 500

update_estado_gasto_persona_bp = Blueprint('update_estado_gasto_persona', __name__)

@update_estado_gasto_persona_bp.route('/update_estado_gasto_persona/<int:id_gasto>/<int:id_persona>', methods=['PUT'])
def update_estado_gasto_persona(id_gasto, id_persona):
    gasto_persona = GastoPersona.query.filter_by(id_gasto=id_gasto, id_persona=id_persona).first()

    if not gasto_persona:
        return jsonify({"error": "No se encontró el registro de gasto_persona para la combinación proporcionada"}), 404

    try:
        # Actualizar el valor de la columna 'estado' a True
        gasto_persona.estado = True
        db.session.commit()

        return jsonify({"message": "Estado de gasto_persona actualizado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar el estado de gasto_persona", "details": str(e)}), 500
    
get_gasto_persona_by_id_gasto_bp = Blueprint('get_gasto_persona_by_id_gasto', __name__)

@get_gasto_persona_by_id_gasto_bp.route('/gasto_persona_by_id_gasto/<int:id_gasto>', methods=['GET'])
def get_gasto_persona_by_id_gasto(id_gasto):
    try:
        # Obtener los gastos de persona relacionados con el ID del gasto proporcionado
        gastos_persona = GastoPersona.query.filter_by(id_gasto=id_gasto).all()

        # Crear una lista de datos de gastos de persona
        gastos_persona_data = []

        for gasto_persona in gastos_persona:
            gastos_persona_data.append({
                "id_persona": gasto_persona.id_persona,
                "id_gasto": gasto_persona.id_gasto,
                "monto_prorrateado": gasto_persona.monto_prorrateado,
                "estado": gasto_persona.estado,
            })

        # Devolver la lista de datos de gastos de persona
        return jsonify({"gastos_persona_list": gastos_persona_data}) if gastos_persona_data else jsonify({"gastos_persona_list": []}), 200

    except Exception as e:
        # En caso de error, devolver un mensaje de error
        return jsonify({"error": "Error al obtener los gastos de persona por ID de gasto", "details": str(e)}), 500    

    
    
 
    
            