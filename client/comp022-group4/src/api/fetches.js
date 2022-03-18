import axios from "axios";

const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";

export async function getMovie(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}`);
}

export async function getMovieGenres(movieId) {
    return axios.get(`${baseURL}/movies/${movieId}/genres`);
}

export async function getMovies(limit) {
    let requestUrl = `${baseURL}/movies`;
    if (limit !== undefined) {
        requestUrl = requestUrl.concat(`?limit=${limit}`);
    }
    return axios.get(requestUrl);
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
