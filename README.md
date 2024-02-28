# Proyecto Final - Cuentas Claras (Front End)

Este repositorio sirve como espacio de desarrollo para el Front End del proyecto final 'Cuentas Claras'.

## Tecnologías Utilizadas
1. Frontend
- React
- CSS / HTML
- Bootstrap
- React Router y react-router-dom
- Redux /Flux

2. Backend
-Flask
-JWT Extended
-Flask SQLAlchemy
-Werkzeug
-Flask Migrate
-Flask CORS
-Psycopg2
-Functools

## Lenguajes
-Javascript
-lenguaje de etiquetas (HTML)
-Python

## Requerimientos de sistema
-Python v3.10
-PostgreSQL 
-DBeaver
-IDE (VSCode)

## Instrucciones de instalación
1. Crear base de datos en local.
   Base de datos: cuentas_claras_db
   Usuario: Postgres
   Contraseña: 12345
   Puerto: 4534
2. Configuración del backend:
   -  cd src/backend
   - pipenv shell
   - pip install flask_jwt_extended
   - pip install flask_sqlalchemy
   - pip install flask_cors
   - pip install psycopg2
   - pip install flask_migrate
   - pip install rut_chile
   - flask db init
   - flask db migrate
   - flask db upgrade
   - python inserts.py
   - python app.py

3. Configuración del frontend:
   - cd..
   - npm install
   - npm start  
