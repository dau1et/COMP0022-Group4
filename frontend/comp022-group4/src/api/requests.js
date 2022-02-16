const API_KEY = "673a60b2dc1f76450ef8d5eaf431c189";

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
}

export default requests;
