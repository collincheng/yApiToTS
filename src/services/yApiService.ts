export class YApiService {
    private readonly username: string;
    private readonly password: string;
    private readonly baseURL: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.baseURL = 'https://yapi.dingdanll.com';
    }

    async login() {
        const response = await fetch(`${this.baseURL}/api/user/login`, {
            method: 'POST',
            body: JSON.stringify({ email: this.username, password: this.password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        return response.json();
    }
}