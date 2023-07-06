import { defineStore } from 'pinia';
import AuthService from '../services/authService';
import UserLoginResource from '../models/userLoginResource';
import UserSaveResource from '../models/userSaveResource';
import UserResource from '../models/userResource';

const user = localStorage.getItem('user');
const userParsed = user? JSON.parse(user) : null;

const initialState = user
    ? { status: { loggedIn: true }, auth: userParsed } 
    : { status: { loggedIn: false}, auth: userParsed };

export const useAuthStore = defineStore('auth', {
    state: () => ({  
        namespaced: true,       
        initialState: initialState,
    }),
    getters: {
        username: (state) => state.initialState.auth.user.username
    },
    actions: {
        login(user: UserLoginResource) {
            return AuthService.login(user).then(
                user => {
                    this.loginSuccess(user);
                    return Promise.resolve(user)
                },
                error => {
                    this.loginFailure();
                    return Promise.reject(error)
                }
            );
        },
        register(user: UserSaveResource) {
            return AuthService.register(user).then(
                response => {
                    this.registerSuccess();
                    return Promise.resolve(response.data);
                },
                error => {
                    this.registerFailure();
                    return Promise.reject(error);
                }
            );
        },
        logout() {
            AuthService.logout();
            this.initialState.status.loggedIn = false;
            this.initialState.auth = null;
        },
        loginSuccess(user: UserResource) {
            this.initialState.status.loggedIn = true;
            this.initialState.auth = user;
        },
        loginFailure() {
            this.initialState.status.loggedIn = false;
            this.initialState.auth = null;
        },
        registerSuccess() {
            this.initialState.status.loggedIn = false;
        },
        registerFailure() {
            this.initialState.status.loggedIn = false;
        },
        isLogged(): boolean {
            return this.initialState.status.loggedIn;
        },
        isAdmin(): boolean {
            const user = this.initialState.auth.user;
            
            return user.role === 'ADMIN';
        }
    },
})