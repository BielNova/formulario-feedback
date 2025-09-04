import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Star, Send, CheckCircle } from 'lucide-react'
import './App.css'
function App() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    productQuality: 0,
    productVariety: 0,
    deliveryEfficiency: 0,
    packaging: 0,
    recommendation: 0,
    commercialSupport: 0,
    observations: '',
    generalFeedback: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStarRating = (field, rating) => {
    setFormData(prev => ({
      ...prev,
      [field]: rating
    }))
  }

  // A lógica de envio para o PHP foi adicionada aqui
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/feedback.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Tentamos ler a resposta como JSON, independentemente do status
      const result = await response.json();

      if (!response.ok) {
        // Se a resposta não for OK, usamos a mensagem do JSON (se houver) ou o statusText
        throw new Error(result.message || `Erro na rede: ${response.statusText}`);
      }

      console.log('Resposta do servidor:', result);

      if (result.status === 'success') {
        setIsSubmitted(true);
      } else {
        // Caso a resposta seja OK mas o status interno seja de erro
        throw new Error(result.message || 'Ocorreu um erro desconhecido no servidor.');
      }

    } catch (err) {
      // Se a resposta nem sequer for JSON válido, err.message terá o erro de parsing
      console.error("Falha ao enviar o formulário:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const StarRating = ({ value, onChange, label }) => {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="transition-colors duration-200 hover:scale-110 transform"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= value
                    ? 'fill-blue-500 text-blue-500'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  const NpsRating = ({ value, onChange, label }) => {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="grid grid-cols-11 gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                num === value
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Não recomendaria</span>
          <span>Recomendaria com certeza</span>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Obrigado!</h2>
            <p className="text-gray-600">
              Seu feedback foi enviado com sucesso. Agradecemos sua parceria e suas valiosas contribuições.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="https://www.valencaquimica.com.br/wp-content/uploads/2021/01/icone.png" 
            alt="Logo Valença Química" 
            className="h-64 w-auto mx-auto mb-4"
          />
          <p className="text-lg text-gray-600">Feedback de Parceiros</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="text-xl text-gray-800">
              Sua opinião é fundamental para nosso crescimento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Seus campos de formulário aqui... */}
              
                {/* Informações da Empresa */}
                <div className="space-y-6">
                 <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                   Informações da Empresa
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="companyName">Nome da Empresa</Label>
                     <Input
                       id="companyName"
                       value={formData.companyName}
                       onChange={(e) => handleInputChange('companyName', e.target.value)}
                       className="border-gray-300 focus:border-blue-500"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="contactName">Nome do Contato</Label>
                     <Input
                       id="contactName"
                       value={formData.contactName}
                       onChange={(e) => handleInputChange('contactName', e.target.value)}
                       className="border-gray-300 focus:border-blue-500"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="email">E-mail</Label>
                     <Input
                       id="email"
                       type="email"
                       value={formData.email}
                       onChange={(e) => handleInputChange('email', e.target.value)}
                       className="border-gray-300 focus:border-blue-500"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="phone">Telefone</Label>
                     <Input
                       id="phone"
                       value={formData.phone}
                       onChange={(e) => handleInputChange('phone', e.target.value)}
                       className="border-gray-300 focus:border-blue-500"
                     />
                   </div>
                 </div>
                </div>

                {/* Avaliações dos Produtos */}
                <div className="space-y-6">
                 <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                   Produtos e Fornecimento
                 </h3>
                 
                 <StarRating
                   value={formData.productQuality}
                   onChange={(rating) => handleStarRating('productQuality', rating)}
                   label="Como você avalia a qualidade geral dos produtos da Valença Química?"
                 />

                 <StarRating
                   value={formData.productVariety}
                   onChange={(rating) => handleStarRating('productVariety', rating)}
                   label="A variedade de produtos atende às necessidades do seu negócio?"
                 />

                 <StarRating
                   value={formData.deliveryEfficiency}
                   onChange={(rating) => handleStarRating('deliveryEfficiency', rating)}
                   label="Como você avalia a pontualidade e eficiência das entregas?"
                 />

                 <StarRating
                   value={formData.packaging}
                   onChange={(rating) => handleStarRating('packaging', rating)}
                   label="A embalagem dos produtos é adequada para transporte e armazenamento?"
                 />

                 <NpsRating
                   value={formData.recommendation}
                   onChange={(rating) => handleStarRating('recommendation', rating)}
                   label="Você recomendaria os produtos da Valença Química para outros parceiros?"
                 />
                </div>

                {/* Suporte e Parceria */}
                <div className="space-y-6">
                 <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                   Suporte e Parceria
                 </h3>

                 <StarRating
                   value={formData.commercialSupport}
                   onChange={(rating) => handleStarRating('commercialSupport', rating)}
                   label="Como você avalia o suporte comercial e relacionamento com nossa equipe?"
                 />

                 <div className="space-y-2">
                   <Label htmlFor="observations">
                     Observações ou sugestões sobre produtos ou fornecimento
                   </Label>
                   <Textarea
                     id="observations"
                     value={formData.observations}
                     onChange={(e) => handleInputChange('observations', e.target.value)}
                     rows={4}
                     className="border-gray-300 focus:border-blue-500"
                     placeholder="Compartilhe suas observações..."
                   />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="generalFeedback">
                     Algo mais sobre a parceria com a Valença Química?
                   </Label>
                   <Textarea
                     id="generalFeedback"
                     value={formData.generalFeedback}
                     onChange={(e) => handleInputChange('generalFeedback', e.target.value)}
                     rows={4}
                     className="border-gray-300 focus:border-blue-500"
                     placeholder="Atendimento, comunicação, sugestões..."
                   />
                 </div>
                </div>
              
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-blue-300"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span>{isLoading ? 'Enviando...' : 'Enviar Feedback'}</span>
                </Button>
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Valença Química. Obrigado pela sua parceria.</p>
        </div>
      </div>
    </div>
  )
}

export default App

