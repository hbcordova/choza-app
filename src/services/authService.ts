import axios from 'axios';
import UserLoginResource from '../models/userLoginResource';
import UserSaveResource from '../models/userSaveResource';

class AuthService {
    BASE_URL: string = "http://localhost:3000/";

    login(loginResource: UserLoginResource) {
        return axios.post(`${this.BASE_URL}/signin`, loginResource)
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    register(saveResource: UserSaveResource) {
        return axios.post(`${this.BASE_URL}/register`, saveResource);
    }

    logout() {
        localStorage.removeItem('user');
    }
}

export default new AuthService();