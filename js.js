import express from "express";
import cloudscraper from "cloudscraper";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/charts", async (req, res) => {
  const releaseUrl = req.query.release;
  if (!releaseUrl) return res.status(400).json({ error: "No release URL" });

  try {
    const html = await cloudscraper.get(releaseUrl);

    // Находим заголовок и жанры
    const title = html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
    const genres = [...html.matchAll(/\/genre\/([^"?#/]+)/g)].map(m => decodeURIComponent(m[1]));

    res.json({
      title,
      genres: [...new Set(genres)],
      message: "Парсер работает! Логику поиска чартов можно будет добавить сюда."
    });

  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));