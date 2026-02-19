export default async function handler(req, res) {
  // 1. Libera a segurança (CORS) para o seu site conseguir ler os dados
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  // Resposta rápida para o preflight do navegador
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category, q } = req.query;

  // 2. Monta a URL oficial
  let mlUrl = `https://api.mercadolibre.com/sites/MLB/search?limit=24`;
  
  if (category && category !== 'undefined') mlUrl += `&category=${category}`;
  if (q && q !== 'undefined') mlUrl += `&q=${encodeURIComponent(q)}`;

  try {
    // 3. Faz a requisição COM O DISFARCE (User-Agent)
    const response = await fetch(mlUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // O SEGREDO ESTÁ AQUI: Dizemos ao Mercado Livre que somos um navegador Chrome comum
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    
    const data = await response.json();

    // Se mesmo com o disfarce o ML devolver 403, passamos o erro adiante
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Mercado Livre bloqueou a requisição.', details: data });
    }

    // 4. Devolve os produtos com sucesso
    res.status(200).json(data);

  } catch (error) {
    console.error("Erro interno no Servidor Vercel:", error);
    res.status(500).json({ error: 'Falha no servidor ao processar os dados.' });
  }
}