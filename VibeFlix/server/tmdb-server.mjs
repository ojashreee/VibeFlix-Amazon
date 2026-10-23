import 'dotenv/config';
import http from 'node:http';
import { ALLOWED_ORIGIN, PORT, TOKEN } from './constants.js';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const tmdbRequest = async (path) => {
  const response = await fetch(`${TMDB_BASE_URL}${path}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }
  return data;
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Content-Type', 'application/json');

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const isNowPlaying = url.pathname === '/api/movies/now-playing';
  const isTrailer = url.pathname === '/api/movies/trailer';
  if (req.method !== 'GET' || (!isNowPlaying && !isTrailer)) {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Not found' }));
  }

  if (isTrailer) {
    const title = url.searchParams.get('title')?.trim();
    if (!title) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Movie title is required' }));
    }
  }

  if (!TOKEN) {
    res.writeHead(503);
    return res.end(JSON.stringify({ error: 'TMDB token is not configured' }));
  }

  try {
    if (isTrailer) {
      const title = url.searchParams.get('title').trim();
      const query = new URLSearchParams({
        query: title,
        include_adult: 'false',
        language: 'en-US',
      });
      const searchData = await tmdbRequest(`/search/movie?${query}`);
      const movie = searchData.results?.[0];
      if (!movie) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: `No movie found for "${title}".` }));
      }

      const videoData = await tmdbRequest(`/movie/${movie.id}/videos?language=en-US`);
      const videos = videoData.results || [];
      const trailer =
        videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official) ||
        videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
        videos.find((video) => video.site === 'YouTube' && video.type === 'Teaser' && video.official) ||
        videos.find((video) => video.site === 'YouTube' && video.type === 'Teaser');

      if (!trailer) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: `No YouTube trailer or teaser found for "${title}".` }));
      }

      res.writeHead(200);
      return res.end(JSON.stringify({
        key: trailer.key,
        name: trailer.name,
        movieTitle: movie.title,
      }));
    }

    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    };
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
      options
    );

    const data = await response.json();
    console.log('TMDB status:', response.status);
    if (!response.ok) {
      console.error('TMDB error response:', data);
    }

    res.writeHead(response.ok ? 200 : response.status);
    res.end(JSON.stringify(data));
  } catch (error) {
    console.error('TMDB request error:', error.message);
    res.writeHead(502);
    res.end(JSON.stringify({ error: error.message || 'TMDB request failed' }));
  }
});

server.listen(PORT, () => {
  console.log(`TMDB server running on port ${PORT}`);
});
