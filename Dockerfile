# Usa uma imagem oficial do PHP com o servidor Apache
FROM php:8.2-apache

# Copia o seu ficheiro de feedback para a pasta do servidor web
COPY feedback.php /var/www/html/

# Copia a pasta vendor (do PHPMailer)
COPY vendor /var/www/html/vendor

# Expõe a porta 80 para o tráfego da web
EXPOSE 80

