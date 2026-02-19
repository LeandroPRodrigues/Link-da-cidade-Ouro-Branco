export default async function handler(req, res) {
  // 1. Libera a segurança para o seu site conseguir ler os dados
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category, q } = req.query;

  // 2. Monta a URL oficial de busca do Mercado Livre
  let mlUrl = `https://api.mercadolibre.com/sites/MLB/search?limit=24`;
  if (category && category !== 'undefined') mlUrl += `&category=${category}`;
  if (q && q !== 'undefined') mlUrl += `&q=${encodeURIComponent(q)}`;

  try {
    // TENTATIVA 1: Usando o proxy CodeTabs (Mascarando o IP da Vercel)
    const proxyUrl1 = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(mlUrl)}`;
    const resp1 = await fetch(proxyUrl1);
    
    if (resp1.ok) {
       const mlData1 = await resp1.json();
       return res.status(200).json(mlData1);
    }
  } catch (e) {
    console.warn("Proxy primário falhou. Tentando rota secundária...");
  }

  try {
    // TENTATIVA 2: Usando o proxy AllOrigins como plano B garantido
    const proxyUrl2 = `https://api.allorigins.win/get?url=${encodeURIComponent(mlUrl)}`;
    const resp2 = await fetch(proxyUrl2);
    const proxyData = await resp2.json();
    
    if (proxyData && proxyData.contents) {
       const mlData2 = JSON.parse(proxyData.contents);
       return res.status(200).json(mlData2);
    }
  } catch (e) {
    console.error("Ambos os proxies falharam.");
  }

  // Se tudo falhar, avisa a página de Ofertas
  return res.status(500).json({ error: 'O catálogo do Mercado Livre está temporariamente indisponível.' });
}