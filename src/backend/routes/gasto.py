from flask import jsonify, Blueprint, request
from models import Gasto, db
 
create_gasto_bp = Blueprint('create_gasto', __name__)

@create_gasto_bp.route('/create_gasto', methods=['POST'])
def create_gasto():
            
    data = request.json
    id_unidad = data.get('id_unidad')
    factura= data.get('factura')
    monto_original= data.get('monto')
    descripcion = data.get('descripcion')


    if not(id_unidad and factura and monto_original and descripcion):
       return jsonify({"error": "El id de la unidad, numero de factura, monto y descripcion es requerido"}), 400     

    nuevo_gasto = Gasto(id_unidad = id_unidad,
                        factura = factura,
                        monto= monto_original,
                        descripcion = descripcion
                    )
    try:
        db.session.add(nuevo_gasto)
        db.session.commit()
        return jsonify({"message": "Gasto creado exitosamente", "id": nuevo_gasto.factura}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear Gasto", "details": str(e)}), 500   
    


get_gasto_por_unidad_bp = Blueprint('get_gasto_por_unidad', __name__)
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
                'monto': gasto.monto,
                'descripcion': gasto.descripcion,
                # 'unidad_nombre': unidad_nombre  # Puedes agregar más detalles de la unidad si es necesario
            }
            gastos_data.append(gasto_info)

        return jsonify({"gastos": gastos_data}), 200

    except Exception as e:
        return jsonify({"error": "Error al obtener los gastos", "details": str(e)}), 500    
