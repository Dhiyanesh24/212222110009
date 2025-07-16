import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

let db = [];

export const setupMockBackend = () => {
  console.log("✅ Mock Backend is Loaded");
  const mock = new MockAdapter(axios, { delayResponse: 300 });

  mock.onPost('http://20.244.56.144:8080/shorten').reply(config => {
    const { links } = JSON.parse(config.data);
    const results = [];

    for (let link of links) {
      const shortcode = link.shortcode || `code${Math.floor(Math.random() * 10000)}`;
      if (db.find(e => e.shortcode === shortcode)) {
        results.push({ error: `Shortcode "${shortcode}" already exists.` });
        continue;
      }

      const now = new Date();
      const entry = {
        shortcode,
        originalURL: link.url,
        createdAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + (link.validity || 30) * 60000).toISOString(),
        clicks: 0,
        clickDetails: [],
      };

      db.push(entry);
      results.push(entry);
    }

    return [200, results];
  });

  mock.onGet(new RegExp('http://20.244.56.144:8080/resolve/.*')).reply(config => {
    const shortcode = config.url.split('/').pop();
    const entry = db.find(e => e.shortcode === shortcode);

    if (!entry) return [404, { error: 'Shortcode not found' }];
    if (new Date() > new Date(entry.expiresAt)) return [410, { error: 'Shortcode expired' }];

    entry.clicks += 1;
    entry.clickDetails.push({
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      location: 'MockLocation',
    });

    return [200, { originalURL: entry.originalURL }];
  });

  mock.onGet('http://20.244.56.144:8080/stats').reply(200, db);

  mock.onPost('http://20.244.56.144/evaluation-service/logs').reply(200, {
    logID: crypto.randomUUID(),
    message: 'log created successfully',
  });
};
