from flask import jsonify, Blueprint, request
from models import Gasto, db
from flask_cors import CORS

create_gasto_bp = Blueprint('create_gasto', __name__)

@create_gasto_bp.route('/create_gasto', methods=['POST'])
def create_gasto():
    try:
        data = request.json
        print("Data recibida:", data)  # Agrega esta línea para imprimir los datos recibidos
        id_unidad = data.get('id_unidad')
        factura = data.get('factura')
        monto_original = data.get('monto_original')
        descripcion = data.get('descripcion')

        if not (id_unidad and factura and monto_original and descripcion):
            return jsonify({"error": "El id de la unidad, numero de factura, monto y descripcion es requerido"}), 400     

        nuevo_gasto = Gasto(
            id_unidad=id_unidad,
            factura=factura,
            monto_original=monto_original,
            descripcion=descripcion
        )

        db.session.add(nuevo_gasto)
        db.session.commit()
        return jsonify({"message": "Gasto creado exitosamente", "id": nuevo_gasto.factura}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear Gasto", "details": str(e)}), 500

  
get_gasto_por_unidad_bp = Blueprint('get_gasto_por_unidad', __name__)
CORS(get_gasto_por_unidad_bp)
@get_gasto_por_unidad_bp.route('/get_gasto_por_unidad/<int:id_unidad>', methods=['GET'])
def get_gasto_por_unidad(id_unidad):
    try:
        gastos = Gasto.query.filter_by(id_unidad=id_unidad).all()
      
        # Por ejemplo, se puedes incluir el nombre de la unidad en la respuesta
        # unidad = Unidad.query.get(id_unidad)
        # unidad_nombre = unidad.nombre if unidad else None

        gastos_data = []
        for gasto in gastos:
            gasto_info = {
                'id': gasto.id,
                'factura': gasto.factura,
                'monto': gasto.monto_original,
                'descripcion': gasto.descripcion,
                # 'unidad_nombre': unidad_nombre  # Puedes agregar más detalles de la unidad si es necesario
            }
            gastos_data.append(gasto_info)


        return jsonify({"gastos": gastos_data}), 200

    except Exception as e:
        return jsonify({"error": "Error al obtener los gastos", "details": str(e)}), 500    



delete_gasto_por_unidad_bp = Blueprint('delete_gasto_por_unidad', __name__)
CORS(delete_gasto_por_unidad_bp)
@delete_gasto_por_unidad_bp.route('/delete_gasto_por_unidad/<int:id_gasto>', methods=['DELETE'])
def delete_persona_by_rut(id_gasto):
    try:
        gasto = Gasto.query.filter_by(id=id_gasto).first()
        if gasto:
             db.session.delete(gasto)
             db.session.commit()
             return jsonify({"message": "Gasto eliminado correctamente"})
        else:
            return jsonify({"error": "Gasto no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": "Error al eliminar gasto", "details": str(e)}), 500
    
from flask import Blueprint, jsonify
from models import Gasto

get_detalle_gasto_bp = Blueprint('get_detalle_gasto', __name__)

@get_detalle_gasto_bp.route('/get_detalle_gasto/<string:factura>', methods=['GET'])
def get_detalle_gasto(factura):
    try:
        gasto = Gasto.query.filter_by(factura=factura).first()

        if gasto:
            gasto_info = {
                'id': gasto.id,
                'id_unidad': gasto.id_unidad,
                'factura': gasto.factura,
                'monto': gasto.monto_original,
                'descripcion': gasto.descripcion
            }
            return jsonify({"gasto": gasto_info}), 200
        else:
            return jsonify({"error": "Gasto no encontrado"}), 404

    except Exception as e:
        return jsonify({"error": "Error al obtener el detalle del gasto", "details": str(e)}), 500
    
