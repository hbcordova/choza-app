import axios from "axios";


export default axios.create({
    baseURL: 'http://localhost:3000/',
    headers: { 
        'Content-type': 'application/json', 
        'Access-Control-Allow-Origin': "*", 
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": ["Origin", "X-Requested-With", "Content-Type", "Accept" ]
    }
});