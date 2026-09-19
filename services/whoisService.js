const axios = require("axios");

const cache = new Map();


async function getDomainInfo(domain) {
  // Check cache first
  if (cache.has(domain)) {
    console.log(`Cache hit: ${domain}`);
    return cache.get(domain);
  }

  // Fetch data from WhoisFreaks
  const response = await axios.get("https://api.whoisfreaks.com/v1.0/whois", {
    params: {
      apiKey: process.env.WHOIS_API_KEY,
      whois: "live",
      domainName: domain,
    },
  });

  const createdDate = response.data.create_date;

  const created = new Date(createdDate);
  const today = new Date();

  const ageDays = Math.floor((today - created) / (1000 * 60 * 60 * 24));

  const ageYears = Math.floor(ageDays / 365);

  const result = {
    domain: response.data.domain_name,
    createdDate,
    ageDays,
    ageYears,
  };

  // Save to cache
  cache.set(domain, result);

  return result;
}

module.exports = {
  getDomainInfo,
};
