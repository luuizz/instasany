export default async function getData() {
    const prismicEndpoint = process.env.PRISMIC_ENDPOINT;
    const prismicAccessToken = process.env.PRISMIC_ACCESS_TOKEN;
  
    if (!prismicEndpoint || !prismicAccessToken) {
      throw new Error("As variáveis de ambiente PRISMIC_ENDPOINT e PRISMIC_ACCESS_TOKEN não estão definidas.");
    }
  
    const url = `${prismicEndpoint}?access_token=${prismicAccessToken}`;
    const res = await fetch(url);

    return res.json();
  }