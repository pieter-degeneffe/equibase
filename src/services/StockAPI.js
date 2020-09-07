import API from "@/services/API";
export default {
    getAllStock: (parameters) => API().get('/api/stock', { params: parameters }),
};