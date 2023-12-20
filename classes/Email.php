<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {

    public $email;
    public $nombre;
    public $token;

    public function __construct( $nombre, $email, $token)
    {
        
        $this->nombre = $nombre;
        $this->email = $email;
        $this->token = $token;
    }

    public function enviarConfirmacion() {
        //Crear el objeto email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '766c3bd693b468';
        $mail->Password = 'ecdaa88539d283';

        $mail-> setFrom('cuentas@appbarberia.com');
        $mail-> addAddress('cuentas@appbarberia.com', 'AppBarberia.com');
        $mail-> Subject = 'Confirma tu cuenta';

        //Set HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong> Hola " . $this->email . " </strong>Has creado tu cuenta en App Barberia
        solo debes confirmarla presionando el siguiente enlace.</p>";
        $contenido .= "<p>Presiona aqui: <a href='http://localhost:3000/confirmar-cuenta?token="
         . $this->token . "'>Confirmar Cuenta</a> </p>";
        $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
        $contenido .= "</html>";
        $mail->Body = $contenido;

        //Enviar el email
        $mail->send();

    }
    
    public function enviarInstrucciones() {
        //Crear el objeto email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '766c3bd693b468';
        $mail->Password = 'ecdaa88539d283';

        $mail-> setFrom('cuentas@appbarberia.com');
        $mail-> addAddress('cuentas@appbarberia.com', 'AppBarberia.com');
        $mail-> Subject = 'Reestablece tu password';

        //Set HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong> Hola " . $this->nombre . " </strong>Has solicitado reestablecer tu password, 
        sigue el siguiente enlace para hacerlo.</p>";
        $contenido .= "<p>Presiona aqui: <a href='http://localhost:5000/recuperar?token="
         . $this->token . "'>Reestablecer Password</a> </p>";
        $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
        $contenido .= "</html>";
        $mail->Body = $contenido;

        //Enviar el email
        $mail->send();
        
    }

}