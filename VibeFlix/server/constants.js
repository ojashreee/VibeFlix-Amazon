export const PORT = Number(process.env.TMDB_PORT) || 8789;
export const TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
export const NOW_PLAYING_URL =
  'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
export const ALLOWED_ORIGIN = 'http://localhost:5173';
