from flask import app, jsonify, Blueprint, request
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
 
send_mail_bp = Blueprint('send_mail', __name__)

@send_mail_bp.route('/send_mail', methods=['POST'])
def send_email():     

        data = request.json    
        to = data.get("to")
        subject = data.get("subject")
        body= data.get("body")

   
        # Configurar los detalles del servidor SMTP de Gmail
        smtp_server = 'smtp-mail.outlook.com'
        smtp_port = 587  # El puerto para TLS
        username = 'cta.claras01@hotmail.com'
        password = 'ctaclaras01%'

       # Crear un mensaje
        message = MIMEMultipart()
        message['From'] = 'cta.claras01@hotmail.com'
        message['To'] = to
        message['Subject'] = subject

    # Agregar el cuerpo del correo
        
        message.attach(MIMEText(body, 'plain'))

    # Iniciar la conexión al servidor SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(username, password)

    # Enviar el correo
        server.send_message(message)

    # Cerrar la conexión al servidor SMTP
        server.quit()
        return 'Correo enviado con éxito', 200



