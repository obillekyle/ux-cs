<?php

use PHPMailer\PHPMailer\PHPMailer;

require 'mailer/PHPMailer.php';
require 'mailer/Exception.php';
require 'mailer/SMTP.php';

stream_context_set_default(array(
    'ssl'                => array(
        'peer_name'          => 'generic-server',
        'verify_peer'        => FALSE,
        'verify_peer_name'   => FALSE,
        'allow_self_signed'  => TRUE
    )
));

function mailTo($to, $subject, $message)
{
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp-mail.outlook.com';
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USER'];
        $mail->Password = $_ENV['MAIL_PASS'];;
        $mail->SMTPSecure = 'ENCRYPTION_STARTTLS';
        $mail->Port = 587;

        $mail->setFrom($_ENV['MAIL_USER'], "Voter's Verification");
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->send();
        return true;
    } catch (Error $e) {
        echo $e;
        return false;
    }
}
