import API from "@/services/API";
export default {
    getAllStock: () => API().get('/api/stock'),
};