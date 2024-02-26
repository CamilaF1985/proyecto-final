from flask import jsonify, Blueprint, request
from models import Persona, db
from rut_chile import rut_chile
from werkzeug.security import generate_password_hash
from flask_cors import CORS
from decorador import handle_preflight

create_persona_inquilino_bp = Blueprint('create_persona_inquilino', __name__)
CORS(create_persona_inquilino_bp, resources={r"/*": {"origins": "http://localhost:3000"}})

@create_persona_inquilino_bp.route('/create_persona_inquilino', methods=['POST', 'OPTIONS'])
@handle_preflight
def create_persona_inquilino():
    
    data = request.json  # Se espera que los datos lleguen en formato JSON desde el front-end

    rut = data.get('rut')  #
    id_unidad = data.get('id_unidad')
    estado = data.get('estado', True)
    email = data.get('email')
    nombre = data.get('nombre')
    id_perfil = data.get('id_perfil', 2)  # Establecer el valor predeterminado de id_perfil, 2 corresponde al id de perfil para "Admin"
    contrasena = data.get('contrasena')
    tareas = data.get('tareas')
    gastos = data.get('gastos')

    # Validar rut https://pypi.org/project/rut-chile/
    if not (rut_chile.is_valid_rut(rut)):
        return jsonify({"error": "rut no valido"}), 400

    nuevo_inquilino = Persona(
        rut=rut[:-2],
        dv=rut[-1],
        id_unidad=id_unidad,
        estado=estado,
        email=email,
        nombre=nombre,
        id_perfil=id_perfil,
        contrasena=generate_password_hash(contrasena, method='pbkdf2:sha256')
    )

    if tareas:
        # Asignar las tareas a la persona
        nuevo_inquilino.tareas = tareas

    if gastos:
        # Asignar los gastos a la persona
        nuevo_inquilino.gastos = gastos

    try:
        db.session.add(nuevo_inquilino)
        db.session.commit()
        return jsonify({"message": "Persona creada exitosamente", "id": nuevo_inquilino.id}), 201
    except Exception as e:
        print(f"Error en la ruta '/create_persona_inquilino': {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

