import API from "@/services/API";
export default {
    getAllStock: (parameters) => API().get('/api/stock', { params: parameters }),
    getStockProduct: (id) => API().get(`/api/stock/${ id }`),
    postStock: (batch) => API().post('/api/stock',{batch}),
    putStock: (batch) => API().put(`/api/stock/${ batch.product }`, { batch })
};