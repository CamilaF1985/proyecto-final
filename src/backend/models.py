from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy import Column, ForeignKey, Integer, String, Date, Boolean


db = SQLAlchemy()
Column= db.Column
relationship = db.relationship
Integer = db.Integer
String = db.String
Date = db.Date
Boolean = db.Boolean
ForeignKey = db.ForeignKey



class Unidad(db.Model):
    __tablename__ = 'unidad'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    direcciones = relationship('Direccion', back_populates='unidad')
    personas = relationship('Persona', back_populates='unidad')
    tareas = relationship('Tarea', back_populates='unidad')
    gastos = relationship('Gasto', back_populates='unidad')
    tareas_personas= relationship('TareaPersona',back_populates='unidad')

class Direccion(db.Model):
    __tablename__ = 'direccion'
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_pais = Column(Integer, ForeignKey('pais.id'), nullable=False)
    pais = relationship('Pais', back_populates='direcciones')  # Relación con la tabla Pais
    id_region = Column(Integer, ForeignKey('region.id'), nullable=False)
    region = relationship('Region', back_populates='direcciones')  # Relación con la tabla Region
    id_comuna  = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    comuna = relationship('Comuna', back_populates='direcciones')  # Relación con la tabla Comuna
    calle = Column(String(100), nullable=False)
    numero = Column(String(10), nullable=False)
    depto_casa = Column(String(10), nullable=False)
    id_unidad = Column(Integer, ForeignKey('unidad.id'), nullable=False)
    unidad = relationship('Unidad', back_populates='direcciones')



class Persona(db.Model):
    __tablename__ = 'persona'
    id = Column(Integer, primary_key=True, autoincrement=True)
    rut = Column(Integer, nullable=False, unique=True)
    dv = Column(String(1), nullable= False, unique=False)
    id_unidad = Column(Integer, ForeignKey('unidad.id'), nullable=False)
    unidad = relationship('Unidad', back_populates='personas')
    estado = Column(Boolean, nullable=False)
    email = Column(String(100), nullable=False)
    nombre = Column(String(100), nullable=False)
    id_perfil = Column(Integer, ForeignKey('perfil.id'), nullable=False)
    perfil = relationship('Perfil', back_populates='personas')
    contrasena = Column(String(250), nullable=False)
    tareas = relationship('TareaPersona', back_populates='persona')
    gastos = relationship('GastoPersona', back_populates='persona')

class Tarea(db.Model):
    __tablename__ = 'tarea'
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_unidad = Column(Integer, ForeignKey('unidad.id'), nullable=False)
    unidad = relationship('Unidad', back_populates='tareas')
    nombre = Column(String(100), nullable=False)
    personas = relationship('TareaPersona', back_populates='tarea')

class TareaPersona(db.Model):
    __tablename__ = 'tarea_persona'
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_persona = Column(Integer, ForeignKey('persona.id'), nullable=False)
    persona = relationship('Persona', back_populates='tareas')
    id_unidad = Column(Integer, ForeignKey('unidad.id'), nullable=False)
    unidad = relationship('Unidad', back_populates='tareas_personas')
    id_tarea = Column(Integer, ForeignKey('tarea.id'), nullable=False)
    tarea = relationship('Tarea', back_populates='personas')
    fecha_inicio = Column(Date, nullable=False)
    fecha_termino = Column(Date, nullable=False)

class Gasto(db.Model):
    __tablename__ = 'gasto'
    id = Column(Integer, primary_key=True, autoincrement=True)
    factura = Column(String(100), nullable=False, unique=True)
    id_unidad = Column(Integer, ForeignKey('unidad.id'), nullable=False)
    unidad = relationship('Unidad', back_populates='gastos')
    monto = Column(Integer, nullable=False)
    descripcion = Column(String(100), nullable=False)
    gastos_relacionados = relationship('GastoPersona', back_populates='gasto')
    

class GastoPersona(db.Model):
    __tablename__ = 'gasto_persona'
    id_persona = Column(Integer, ForeignKey('persona.id'), nullable=False, primary_key=True)
    persona = relationship('Persona', backref='gasto_persona')
    id_gasto = Column(Integer, ForeignKey('gasto.id'), nullable=False, primary_key=True)
    gasto = relationship('Gasto', back_populates='gastos_relacionados')
    monto_prorrateado = Column(Integer, nullable=False)

  

class Perfil(db.Model):
    __tablename__ = 'perfil'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False)
    personas = relationship('Persona', back_populates='perfil')

class Pais(db.Model):
    __tablename__ = 'pais'
    id = Column(Integer, primary_key=True, autoincrement=True)
    codigo_iso = Column(String(3), nullable=False, unique=True)
    nombre = Column(String(250), nullable=False)
    regiones = relationship('Region', back_populates='pais')
    direcciones = relationship('Direccion', back_populates='pais')

class Region(db.Model):
    __tablename__ = 'region'
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_pais = Column(Integer, ForeignKey('pais.id'), nullable=False)
    nombre = Column(String(250), nullable=False)
    comunas = relationship('Comuna', back_populates='region')
    pais = relationship('Pais', back_populates='regiones')
    direcciones = relationship("Direccion") 

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_region = Column(Integer, ForeignKey('region.id'), nullable=False)
    nombre = Column(String(250), nullable=False)
    region = relationship('Region', back_populates='comunas')    
    direcciones = relationship("Direccion") 