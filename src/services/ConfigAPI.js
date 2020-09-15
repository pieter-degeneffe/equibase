import API from "@/services/API";
export default {
    getProductConfig: () => API().get('/api/config/product'),
    getModConfig: () => API().get('/api/config/mod'),
};