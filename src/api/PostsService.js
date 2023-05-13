import axios from "axios";
import AuthService from "./AuthService";

export default class PostsService {
	static axiosInstance = axios.create({
		baseURL: process.env.REACT_APP_API_URL + '/Post',
		headers: AuthService.getAuthHeader(),
	});

	static axiosInstanceVak = axios.create({
		baseURL: process.env.REACT_APP_API_URL + '/Posts',
		headers: AuthService.getAuthHeader(),
	});

	static axiosInstanceResume = axios.create({   //Test
		baseURL: process.env.REACT_APP_API_URL + '/Resume'
		//headers: AuthService.getAuthHeader(),
	});
	static axiosInstanceFedd = axios.create({   //Test
		baseURL: process.env.REACT_APP_API_URL + '/Feedback'
		//headers: AuthService.getAuthHeader(),
	});

	static async getAll() {
		const response = await this.axiosInstance.get();
		return response;
	}
	static async getById(id) {
		const response = await this.axiosInstanceVak.get(`/${id}`);
		console.log(response)
		return response;
	}
	static async getByIdFeed(id) {
		const response = await this.axiosInstanceVak.get(`/${id}/feedbacks`);
		console.log(response)
		return response;
	}
	static async getByResumeId(id) {
		const response = await this.axiosInstanceResume.get(`/${id}`);
		return response;
	}
	static async createPost(post) {			
		const response = await this.axiosInstanceVak.post('', post);
		console.log(AuthService.getAuthHeader())
		return response;
	}
	static async createResume(post) {
		const response = await this.axiosInstanceResume.post('', post);
		console.log(response)
		return response;
	}
	static async editPost(post) {
		const response = await this.axiosInstanceVak.put(`/${post.id}`, post);
		return response;
	}
	static async postFeed(feed) {
		console.log("Шаг 2")
		console.log(feed)
		const response = await this.axiosInstanceFedd.post('', feed);
		return response;
	}
	static async editResume(post) {
		console.log("Tut")
		const response = await this.axiosInstanceResume.put(`/${post.id}`, post);
		return response;
	}
	static async deletePost(id) {
		const response = await this.axiosInstanceVak.delete(`/${id}`);
		return response;
	}
	static async deleteResume(id) {
		console.log("Tut")
		const response = await this.axiosInstanceResume.delete(`/${id}`);
		return response;
	}
	static async getCommentsByPostId(id) {
		const response = await this.axiosInstance.get(`/${id}/comments`);
		return response;
	}
	static updateInstance() {
		this.axiosInstance = axios.create({
			baseURL: process.env.REACT_APP_API_URL + '/Posts',
			headers: AuthService.getAuthHeader(),
		});
	}
}
