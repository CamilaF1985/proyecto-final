from flask import jsonify, Blueprint, request
from models import GastoPersona, db
 
create_gasto_persona_bp = Blueprint('create_gasto_persona', __name__)

@create_gasto_persona_bp.route('/create_gasto_persona', methods=['POST'])
def create_gasto_persona():
                
    data = request.json
    id_persona = data.get('id_persona')
    id_gasto = data.get('id_gasto')
    monto_prorrateado = data.get('monto_prorrateado')


    if not ( id_persona and id_gasto and monto_prorrateado):
       return jsonify({"error": "El id de la unidad id_gasto y monto_prorrateado son requerido"}),400
    

    nuevo_gasto_persona = GastoPersona(id_persona = id_persona,
                                       id_gasto = id_gasto,
                                       monto_prorrateado = monto_prorrateado
                                       )

    try:
        db.session.add(nuevo_gasto_persona)
        db.session.commit()
        return jsonify({"message":"gasto persona creado exitoso"}),201
    except Exception as e:
        db.session.rollback()
        return jsonify({"mensaje" : "Error al crear nuevo gasto", "details": str(e)}), 500
    


get_gasto_por_persona_bp = Blueprint('get_gasto_por_persona', __name__)
@get_gasto_por_persona_bp.route('/get_gasto_por_persona/<int:id_persona>', methods=['GET'])

def get_gasto_por_persona(id_persona):
    try:
        gastos = GastoPersona.query.filter_by(id_persona=id_persona).all()
      
        # Por ejemplo, se puedes incluir el nombre de la unidad en la respuesta
        # unidad = Unidad.query.get(id_unidad)
        # unidad_nombre = unidad.nombre if unidad else None

        gastos_data = []
        for gasto in gastos:
            gasto_info = {
                'id_perosna': gasto.id_persona,
                'factura': gasto.id_gasto,
                'monto': gasto.monto_prorrateado
            }
            gastos_data.append(gasto_info)

        return jsonify({"gastos": gastos_data}), 200

    except Exception as e:
        return jsonify({"error": "Error al obtener los gastos de persona", "details": str(e)}), 500        