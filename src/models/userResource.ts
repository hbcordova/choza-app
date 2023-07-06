export default class UserResource {
    id: number = 0;
    username: string = '';
    email: string = '';
    password: string = '';
    role: string = '';

    constructor(id: number, username: string, email: string, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = this.role;
    }
}