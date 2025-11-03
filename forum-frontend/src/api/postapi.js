import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // your backend URL

const postApi = axios.create({
  baseURL: API_URL,
});

//Add request interceptor to attach token automatically

export default postApi;

//Axios as a messenger between your app and the server
//Creates an Axios instance pre-configured with the backend URL.

//This way, later you can just do api.get('/api/posts') instead of typing http://localhost:5000/api/posts every time.

//You can also later add headers like JWT tokens to this instanc