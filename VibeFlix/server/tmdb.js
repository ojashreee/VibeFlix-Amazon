export async function getMovieTrailer(movieTitle) {
  const params = new URLSearchParams({ title: movieTitle });
  const response = await fetch(`/api/movies/trailer?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `TMDB request failed: ${response.status}`);
  }

  return data;
}
