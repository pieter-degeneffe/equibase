import API from "@/services/API";
export default {
    getAllStock: (params) => API().get('/api/stock', { params }),
    getStockProduct: (id, params) => API().get(`/api/stock/${ id }`, {params}),
    getStockProductMods: (id, bool) => API().get(`/api/stock/${ id }/mods`, {bool}),
    postStock: (batch) => API().post('/api/stock',batch),
    putStock: (productId, data) => API().put(`/api/stock/${ productId }`, data),
    deactivateBatch: (batch) => API().put(`/api/stock/${ batch }/deactivate`),
    activateBatch: (batch) => API().put(`/api/stock/${ batch }/activate`)
};