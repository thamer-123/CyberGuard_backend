const axios = require("axios");

let cachedFeed = [];
let lastUpdate = 0;

const CACHE_DURATION =
  1000 * 60 * 60; // 1 hour

async function refreshFeed() {

  const now = Date.now();

  if (
    cachedFeed.length > 0 &&
    now - lastUpdate < CACHE_DURATION
  ) {

    console.log(
      "[OpenPhish] Using cached feed"
    );

    return cachedFeed;
  }

  console.log(
    "[OpenPhish] Downloading feed..."
  );

  const response = await axios.get(
    "https://raw.githubusercontent.com/openphish/public_feed/main/feed.txt"
  );

  cachedFeed =
    response.data
      .split("\n")
      .filter(Boolean);

  lastUpdate = now;

  console.log(
    `[OpenPhish] Loaded ${cachedFeed.length} entries`
  );

  return cachedFeed;
}

async function checkOpenPhish(domain) {

  const feed = await refreshFeed();

  const listed = feed.some((url) => {

    try {

      const hostname =
        new URL(url).hostname
          .replace("www.", "");

      return hostname === domain;

    } catch {

      return false;

    }

  });

  return {
    listed
  };

}

module.exports = {
  checkOpenPhish
};