import axios from "axios";

const BASE_URL = process.env.NODE_ENV !== 'production'
	? 'https://trusting-jeweled-straw.glitch.me/api/v1'
	: 'https://trusting-jeweled-straw.glitch.me/api/v1'

const axiosClient = axios.create({
	baseURL: BASE_URL,
	// timeout: 1000,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
	},
});

axiosClient.interceptors.request.use(async (config) => {
	// Do something before request is sent
	// const token = await getFireBaseToken();
	const token = localStorage.getItem("TOKEN");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		// console.log(token)
		localStorage.setItem('TOKEN', token);
	}

	return config;

}, (error) => {
	// Do something with request error
	return Promise.reject(error);
});

// Add a response interceptor
axiosClient.interceptors.response.use((response) => {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	if (response && response.data) {
		return response.data;
	}

}, (error) => {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error
	return Promise.reject(error);
});

export default axiosClient