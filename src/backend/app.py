from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS  # Importa el módulo CORS
from models import db  # Importa la instancia de SQLAlchemy desde el archivo models
from routes.auth import get_auth_bp
from routes.perfil import get_all_perfil_bp  # Asegúrate de importar el blueprint de las rutas
from routes.region import get_all_region_bp
from routes.comuna import get_all_comuna_bp
from routes.persona_admin import create_persona_admin_bp
from routes.persona_inquilino import create_persona_inquilino_bp
from routes.unidad import create_unidad_bp
from routes.tarea import create_tarea_bp
from routes.gasto import create_gasto_bp ,get_gasto_por_unidad_bp
from routes.gasto_persona import create_gasto_persona_bp, get_gasto_por_persona_bp
from routes.direccion import create_direccion_bp  
from routes.persona import persona_bp, get_person_by_unidad_bp, update_email_persona_bp 
from routes.tarea_persona import create_tarea_persona_bp

#12345
#10644

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
 
# Configurar la extensión Flask-JWT-Extended usando la función del archivo de configuración
app.config["JWT_SECRET_KEY"] = "505f2af45d4a0e161a7dd2d12fdae47f"
jwt = JWTManager(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:10644@localhost:5434/cuentas_claras_db'
db.init_app(app)  # Inicializa el objeto db con la aplicación Flask
migrate = Migrate(app, db)

# Registra las rutas después de haber importado el blueprint
app.register_blueprint(get_auth_bp, url_prefix='/auth')
app.register_blueprint(get_all_perfil_bp)
app.register_blueprint(get_all_region_bp)
app.register_blueprint(get_all_comuna_bp)
app.register_blueprint(create_unidad_bp)
app.register_blueprint(create_persona_admin_bp)
app.register_blueprint(create_persona_inquilino_bp)
app.register_blueprint(create_tarea_bp)
app.register_blueprint(create_gasto_bp)
app.register_blueprint(get_gasto_por_unidad_bp)
app.register_blueprint(create_gasto_persona_bp)
app.register_blueprint(get_gasto_por_persona_bp)
app.register_blueprint(create_direccion_bp)  # Utiliza el mismo nombre del blueprint que has definido en el archivo de rutas
app.register_blueprint(persona_bp) 
app.register_blueprint(get_person_by_unidad_bp) 
app.register_blueprint(create_tarea_persona_bp)
app.register_blueprint(update_email_persona_bp)


if __name__ == '__main__':
    app.run(debug=True)




#flask db init
#flask db migrate -m "initial migration"
#flask db upgrade

