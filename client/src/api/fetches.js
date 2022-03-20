import axios from "axios";

const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";

export async function getMovie(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}`);
}

export async function getMovieGenres(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/genres`);
}

export async function getMovieLanguage(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/language`);
}

export async function getMovieTranslations(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/translations`);
}

export async function getMoviePublishers(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/publishers`);
}

export async function getMovieActors(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/actors`);
}


export async function getPredictedRating(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/pred_rating`);
}

export async function getPredictedPersonalityRatings(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/pred_personality_ratings`);
}

export async function getPredictedPersonalityTraits(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/pred_personality_traits`);
}

export async function getMovies(limit) {
    let requestUrl = `${baseURL}/movies`;
    if (limit !== undefined) {
        requestUrl = requestUrl.concat(`?limit=${limit}`);
    }
    return axios.get(requestUrl);
}

export async function getGenres() {
    return axios.get(`${baseURL}/genres`);
}

export async function getTopMoviesBy(attribute, limit) {
    let requestUrl = `${baseURL}/movies?sort_by=${attribute}&sort_direction=DESC`;
    if (limit !== undefined) {
        requestUrl = requestUrl.concat(`&limit=${limit}`);
    }
    return axios.get(requestUrl);
}

export async function getMoviesByGenre(genre, limit) {
    let requestUrl = `${baseURL}/movies?genres=${genre}`;
    if (limit !== undefined) {
        requestUrl = requestUrl.concat(`&limit=${limit}`);
    }
    return axios.get(requestUrl);
}

export async function getMovieTags(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/tags`);
}

export async function getTagPersonalityData(tagId, limit) {
    let requestUrl = `${baseURL}/tags/${tagId}/personality_data`;
    if (limit !== undefined) {
        requestUrl = requestUrl.concat(`&limit=${limit}`);
    }
    return axios.get(requestUrl);
}







// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_SERVER_URL
// });

// // GET and DELETE requests send parameters off differently to POST and PATCH
// function configureParams(type, parameters = {}) {
//   if (type === "get" || type === "delete") {
//     const { responseType, ...params } = parameters;
//     return { params, responseType };
//   } else return parameters;
// }
// function returnRequestPromise(type, url, params) {
//   return axiosInstance[type](url, configureParams(type, params));
// }

// export { returnRequestPromise, axiosInstance };

// import { returnRequestPromise, sendRequest } from "../../utils/axiosRequest";
// export const getCourseCollections = setter => {
//   returnRequestPromise("get", `course/collection`)
//     .then(courseCollection => setter(courseCollection.data))
//     .catch(error => console.log(error));
// };
