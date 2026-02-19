import https from 'https';

export default function handler(req, res) {
  // 1. Libera as portas de segurança (CORS) para o site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  // Preflight check do navegador
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category, q } = req.query;

  // 2. Monta o caminho exato do Mercado Livre
  let path = `/sites/MLB/search?limit=24`;
  if (category && category !== 'undefined') path += `&category=${category}`;
  if (q && q !== 'undefined') path += `&q=${encodeURIComponent(q)}`;

  const options = {
    hostname: 'api.mercadolibre.com',
    path: path,
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };

  // 3. Faz a requisição usando o módulo nativo absoluto do servidor (Sem depender de fetch)
  const request = https.request(options, (response) => {
    let data = '';

    // Recebe os pedaços de dados do Mercado Livre
    response.on('data', (chunk) => {
      data += chunk;
    });

    // Quando terminar de receber tudo:
    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        
        // Se a resposta for OK (Status 200)
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json(jsonData);
        } else {
          // Se o ML bloquear o servidor
          res.status(response.statusCode).json({ error: 'Bloqueio na API do Mercado Livre', details: jsonData });
        }
      } catch (e) {
        res.status(500).json({ error: 'Falha ao processar os dados do Mercado Livre.' });
      }
    });
  });

  // Se der erro de rede na Vercel
  request.on('error', (error) => {
    res.status(500).json({ error: 'Erro de rede no Servidor Vercel.', details: error.message });
  });

  request.end();
}