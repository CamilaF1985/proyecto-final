from flask import jsonify, Blueprint, request
from models import Persona, db
from rut_chile import rut_chile
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, jwt_required
from flask_cors import CORS
from decorador import handle_preflight

create_persona_admin_bp = Blueprint('create_persona_admin', __name__)
CORS(create_persona_admin_bp, resources={r"/*": {"origins": "http://localhost:3000"}})
@jwt_required()
@create_persona_admin_bp.route('/create_persona_admin', methods=['POST', 'OPTIONS'])
@handle_preflight
def create_persona_admin(): 

        data = request.json  # Se espera que los datos lleguen en formato JSON desde el front-end

        rut = data.get('rut').strip().replace(".","")
        id_unidad = data.get('id_unidad')
        estado = data.get('estado', True)  # no requerido en el front
        email = data.get('email')
        nombre = data.get('nombre')
        id_perfil = data.get('id_perfil', 1)  # no requerido en el front
        contrasena = data.get('contrasena')
        tareas = data.get('tareas')
        gastos = data.get('gastos')

        # Validar que no exista más de un administrador por unidad
        existing_admin = Persona.query.filter_by(id_unidad=id_unidad, id_perfil=1).first()
        if existing_admin:
            return jsonify({"error": "Ya existe un administrador para esta unidad"}), 400

        # Validar rut https://pypi.org/project/rut-chile/
        if not(rut_chile.is_valid_rut(rut)):
            return jsonify({"error": "rut no valido"}), 400

        nuevo_admin = Persona(
            rut=rut[:-2],
            dv=rut[-1],
            id_unidad=id_unidad,
            estado=estado,
            email=email,
            nombre=nombre,
            id_perfil=id_perfil,
            contrasena=generate_password_hash(contrasena, method='pbkdf2:sha256')
        )

        
        try:
            db.session.add(nuevo_admin)
            db.session.commit()
            return jsonify({"message": "Persona creada exitosamente", "id": nuevo_admin.id}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Error al crear la persona", "details": str(e)}), 500


   
   


