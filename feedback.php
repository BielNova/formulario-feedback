<?php
// --- Início da Configuração do PHPMailer ---
// Importa as classes do PHPMailer para o namespace global
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Carrega o autoloader do Composer
// Certifique-se de ter executado 'composer require phpmailer/phpmailer' no seu terminal
require 'vendor/autoload.php';
// --- Fim da Configuração do PHPMailer ---


// Define que a resposta será sempre em formato JSON
header("Content-Type: application/json; charset=UTF-8");

// Configurações de CORS para permitir acesso do seu frontend
header("Access-Control-Allow-Origin: *"); // Em produção, restrinja para o seu domínio: "http://localhost:5173"
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// O navegador envia uma requisição OPTIONS antes do POST para verificar as permissões de CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Tratamento de Erros Robusto ---
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    // Valida o método da requisição
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405); // Método não permitido
        throw new Exception('Método não permitido. Utilize POST.');
    }

    // Pega os dados JSON enviados pelo React
    $json_data = file_get_contents('php://input');

    // Valida se os dados não estão vazios
    if (empty($json_data)) {
        http_response_code(400); // Requisição inválida
        throw new Exception('Nenhum dado recebido.');
    }

    // Decodifica o JSON
    $data = json_decode($json_data, true);

    // Valida se o JSON é válido
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400); // Requisição inválida
        throw new Exception('O JSON enviado é inválido.');
    }

    // --- Ação Principal: Enviar E-mail com PHPMailer ---
    $mail = new PHPMailer(true);

    // Extrai os dados com valores padrão
    $companyName = $data["companyName"] ?? "Não informado";
    $contactName = $data["contactName"] ?? "Não informado";
    $email = $data["email"] ?? "Não informado";
    $phone = $data["phone"] ?? "Não informado";
    $productQuality = $data["productQuality"] ?? 0;
    $productVariety = $data["productVariety"] ?? 0;
    $deliveryEfficiency = $data["deliveryEfficiency"] ?? 0;
    $packaging = $data["packaging"] ?? 0;
    $recommendation = $data["recommendation"] ?? 0;
    $commercialSupport = $data["commercialSupport"] ?? 0;
    $observations = $data["observations"] ?? "Nenhuma";
    $generalFeedback = $data["generalFeedback"] ?? "Nenhum";

    // Monta o corpo do e-mail
    $body = "
Novo feedback recebido em " . date("d/m/Y H:i:s") . ":

Informações da Empresa:
- Empresa: $companyName
- Contato: $contactName
- Email: $email
- Telefone: $phone

Avaliações:
- Qualidade dos produtos: $productQuality / 5
- Variedade de produtos: $productVariety / 5
- Pontualidade nas entregas: $deliveryEfficiency / 5
- Embalagem: $packaging / 5
- Suporte comercial: $commercialSupport / 5
- Recomendação (NPS): $recommendation / 10

Comentários:
- Observações sobre produtos/fornecimento:
$observations

- Feedback geral sobre a parceria:
$generalFeedback
    ";

    // Configurações do servidor de e-mail (SMTP)
    // $mail->SMTPDebug = 2; // Descomente para ver o log de depuração detalhado
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; // Ex: smtp.gmail.com
    $mail->SMTPAuth   = true;
    $mail->Username   = 'gabrielassefnova@gmail.com'; // O seu e-mail do Gmail
    $mail->Password   = 'xuid ngll hjzh vssi';    // A sua "App Password" do Gmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Destinatários
    $mail->setFrom('gabrielassefnova@gmail.com', 'Formulário Valença Química');
    $mail->addAddress('gabrielassefnova@gmail.com', 'Destinatário'); // Para quem o e-mail será enviado
    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($email, $contactName);
    }

    // Conteúdo
    $mail->isHTML(false); // Define o e-mail como texto puro
    $mail->Subject = '📩 Novo Feedback - Valença Química';
    $mail->Body    = $body;

    $mail->send();

    // Resposta de sucesso (compatível com o React)
    http_response_code(200); // OK
    echo json_encode(['status' => 'success', 'message' => 'Feedback enviado com sucesso!']);

} catch (Throwable $e) {
    // Captura qualquer exceção ou erro e o devolve como um JSON limpo
    http_response_code(500); // Erro Interno do Servidor
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
?>

