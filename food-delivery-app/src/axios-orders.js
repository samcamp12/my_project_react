import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://myburgerapp-81c84.firebaseio.com/' // set up a baseURL 
});

export default instance;