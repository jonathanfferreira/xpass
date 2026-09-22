export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt não fornecido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return graceful guidance if API key isn't configured in Vercel environment
    return res.status(200).json({
      reply: `Olá! Seu AI Coach está online. Para ativar respostas geradas por IA em tempo real com o Gemini, configure a variável de ambiente GEMINI_API_KEY nas configurações do projeto na Vercel.`
    });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Você é o XPASS Coach, um assistente especializado em treino, musculação, nutrição esportiva e orientação de academias.
Responda de forma concisa, motivadora, com tom moderno/cyberpunk fitness e dicas práticas em português do Brasil.
Mensagem do aluno: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return res.status(200).json({
        reply: 'Consistência nos treinos e nutrição adequada são a chave! Posso te ajudar a encontrar academias ou sugerir exercícios para hoje.'
      });
    }

    const data = await geminiRes.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pronto para o próximo treino! Como posso ajudar?';

    return res.status(200).json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in coach API:', error);
    return res.status(200).json({
      reply: 'Foco no progresso! Beba água, aqueça bem as articulações antes de iniciar as cargas e mantenha a consistência.'
    });
  }
}
