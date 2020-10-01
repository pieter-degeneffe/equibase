import API from "@/services/API";
export default {
    getAllStock: (params) => API().get('/api/stock', { params }),
    getStockProduct: (id, params) => API().get(`/api/stock/${ id }`, {params}),
    postStock: (batch) => API().post('/api/stock',batch),
    putStock: (batch) => API().put(`/api/stock/${ batch.product }`, { batch }),
    deactivateBatch: (batch) => API().put(`/api/stock/${ batch }/deactivate`),
    activateBatch: (batch) => API().put(`/api/stock/${ batch }/activate`)
};