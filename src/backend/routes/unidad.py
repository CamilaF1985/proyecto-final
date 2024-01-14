from flask import jsonify, Blueprint, request
from models import Unidad, db
 
create_unidad_bp = Blueprint('create_unidad', __name__)

# Crea unidad
# requiere el nombre de la unidad desde el front para insertar registro en el modelo
@create_unidad_bp.route('/create_unidad', methods=['POST'])
def create_unidad():
    data = request.json  # Se espera que los datos lleguen en formato JSON desde el front-end
    nombre = data.get('nombre')  # Se espera que el nombre llegue como parte de los datos

    if not nombre:
        return jsonify({"error": "El nombre de la unidad es requerido"}), 400

    nueva_unidad = Unidad(nombre=nombre)

    try:
        db.session.add(nueva_unidad)
        db.session.commit()
        return jsonify({"message": "Unidad creada exitosamente", "id": nueva_unidad.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear la unidad", "details": str(e)}), 500   

@create_unidad_bp.route('/unidad/<int:unidad_id>', methods=['GET'])
def obtener_unidad(unidad_id):
    try:
        unidad = Unidad.query.get(unidad_id)
        if unidad:
            # Si se encuentra la unidad, devuelve sus datos
            print(f"Unidad encontrada - ID: {unidad.id}, Nombre: {unidad.nombre}")
            return jsonify({
                "id": unidad.id,
                "nombre": unidad.nombre,
                # Agrega más campos según sea necesario
            })
        else:
            # Si no se encuentra la unidad, devuelve un mensaje de error
            print("Unidad no encontrada")
            return jsonify({"error": "Unidad no encontrada"}), 404
    except Exception as e:
        # En caso de error, devuelve un mensaje de error con detalles
        print(f"Error al obtener la unidad: {str(e)}")
        return jsonify({"error": "Error al obtener la unidad", "details": str(e)}), 500


    


