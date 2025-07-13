import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { id = '5062' } = req.query;

  const url = `https://macizlevip315.shop/wp-content/themes/ikisifirbirdokuz/match-center.php?id=${id}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

    // M3U8 linkini yakala
    const m3u8Url = await page.evaluate(() => {
      const matches = document.body.innerHTML.match(/https?:\/\/[^"]+\.m3u8/);
      return matches ? matches[0] : null;
    });

    if (!m3u8Url) {
      res.status(404).json({ error: 'm3u8 bulunamadı' });
      return;
    }

    res.status(200).json({ url: m3u8Url, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
}
