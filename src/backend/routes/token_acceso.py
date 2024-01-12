from flask import jsonify
from flask_jwt_extended import create_access_token
from models import Persona

@app.route("/login", methods=["POST"])



def create_token():
    # Extraer el nombre de usuario y la contraseña de la solicitud JSON
    rut = request.json.get("rut", None)
    contrasena = request.json.get("contrasena", None)

    # Realizar una consulta para obtener el usuario de la base de datos
    usuario = Persona.query.filter_by(rut=rut, contrasena=contrasena).first()

    # Verificar si el usuario no existe en la base de datos
    if usuario is None:
        # Retornar un mensaje de error si el usuario no existe o las credenciales son incorrectas
        return jsonify({"msg": "Bad usuario o contraseña"}), 401
    
    # Crear un token de acceso utilizando la identidad del usuario (en este caso, el ID del usuario)
    access_token = create_access_token(identity=usuario.id)

    # Retornar el token de acceso y el ID del usuario en formato JSON
    return jsonify({ "token": access_token, "usuario": usuario.id })
