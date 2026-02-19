export default async function handler(req, res) {
    // Pega os parâmetros que nosso site vai enviar (categoria ou termo de busca)
    const { category, q } = req.query;
  
    // Monta a URL oficial do Mercado Livre
    let mlUrl = `https://api.mercadolivre.com/sites/MLB/search?limit=24`;
    if (category && category !== 'undefined') mlUrl += `&category=${category}`;
    if (q && q !== 'undefined') mlUrl += `&q=${encodeURIComponent(q)}`;
  
    try {
      // O Servidor da Vercel faz a requisição (Sem bloqueio de CORS/Adblock)
      const response = await fetch(mlUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erro na API do ML: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Permite que o nosso front-end leia a resposta
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Content-Type', 'application/json');
  
      // Devolve os produtos para o site
      res.status(200).json(data);
    } catch (error) {
      console.error("Erro interno na Serverless Function:", error);
      res.status(500).json({ error: 'Falha ao buscar ofertas' });
    }
  }