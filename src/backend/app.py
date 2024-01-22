from datetime import timedelta
from functools import wraps
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from psycopg2 import OperationalError
from models import db
from routes.auth import get_auth_bp
from routes.perfil import get_all_perfil_bp
from routes.region import get_all_region_bp
from routes.comuna import get_all_comuna_bp
from routes.comuna import get_comunas_by_region
from routes.persona_admin import create_persona_admin_bp
from routes.persona_inquilino import create_persona_inquilino_bp
from routes.unidad import create_unidad_bp
from routes.tarea import create_tarea_bp, delete_tarea_por_unidad_bp, get_tarea_by_unidad_bp, get_tarea_by_name_bp
from routes.gasto import create_gasto_bp, get_gasto_por_unidad_bp, delete_gasto_por_unidad_bp
from routes.gasto_persona import create_gasto_persona_bp, get_gasto_por_persona_bp
from routes.direccion import create_direccion_bp  
from routes.persona import persona_bp, get_person_by_unidad_bp, update_email_persona_bp ,delete_persona_by_rut_bp
from routes.tarea_persona import create_tarea_persona_bp, delete_tarea_persona_bp, get_tarea_persona_id_by_task_id_bp
from routes.send_mail import send_mail_bp
from routes.invalida_token import elimina_token_bp


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "methods": ["OPTIONS", "GET", "POST", "PUT", "DELETE"], "allow_headers": ["Content-Type"]}}, supports_credentials=True)

#12345
#10644

# Configurar la extensión Flask-JWT-Extended usando la función del archivo de configuración
app.config["JWT_SECRET_KEY"] = "505f2af45d4a0e161a7dd2d12fdae47f"

# Configurar el tiempo de expiración predeterminado para los tokens (opcional)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=10)

jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:12345@localhost:5434/cuentas_claras_db'
db.init_app(app)
  

migrate = Migrate(app, db)



# def verifica_conexion_db(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         try:
#             # Intenta realizar una operación que requiera la conexión a la base de datos
#             db.engine.execute("SELECT 1")
#             # Si se llega a este punto, la conexión se ha establecido con éxito
#             return f(*args, **kwargs)
#         except OperationalError as e:
#             # En caso de que ocurra un error de conexión a la base de datos, maneja la excepción aquí
#             mensaje_error = 'Error de conexión a la base de datos: {}'.format(e)
#             return jsonify({'error': mensaje_error}), 500
#     return decorated_function

# Registra las rutas después de haber importado el blueprint

app.register_blueprint(get_auth_bp, url_prefix='/auth')
app.register_blueprint(get_all_perfil_bp)
app.register_blueprint(get_all_region_bp)
app.register_blueprint(get_all_comuna_bp) 

app.register_blueprint(create_unidad_bp)

app.register_blueprint(create_persona_admin_bp)
app.register_blueprint(create_persona_inquilino_bp)

app.register_blueprint(create_tarea_bp)
app.register_blueprint(delete_tarea_por_unidad_bp)
app.register_blueprint(create_tarea_persona_bp)
app.register_blueprint(delete_tarea_persona_bp)
app.register_blueprint(get_tarea_persona_id_by_task_id_bp)
app.register_blueprint(get_tarea_by_unidad_bp)
app.register_blueprint(get_tarea_by_name_bp)

app.register_blueprint(create_gasto_bp)
app.register_blueprint(delete_gasto_por_unidad_bp)
app.register_blueprint(get_gasto_por_unidad_bp)

app.register_blueprint(create_gasto_persona_bp)
app.register_blueprint(get_gasto_por_persona_bp)

app.register_blueprint(create_direccion_bp)
app.register_blueprint(update_email_persona_bp)

app.register_blueprint(persona_bp)
app.register_blueprint(delete_persona_by_rut_bp)
app.register_blueprint(get_person_by_unidad_bp)

app.register_blueprint(send_mail_bp)

app.register_blueprint(elimina_token_bp)



if __name__ == '__main__':
    app.run(debug=True)





#flask db init
#flask db migrate -m "initial migration"
#flask db upgrade

