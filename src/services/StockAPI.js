import API from "@/services/API";
export default {
    getAllStock: (params) => API().get('/api/stock', { params }),
    getStockMods: (outgoing, params) => API().get(`/api/stock/mods${outgoing ? '?out=true' : ''}`, {params}),
    getStockProduct: (id, params) => API().get(`/api/stock/${ id }`, {params}),
    getStockProductMods: (id, outgoing, params) => API().get(`/api/stock/${ id }/mods${outgoing ? '?out=true' : ''}`, {params}),
    postStock: (batch) => API().post('/api/stock',batch),
    putStock: (productId, data, batchId) => API().put(`/api/stock/${ productId }/${ batchId ? batchId : ''}`, data),
    deactivateBatch: (batch) => API().put(`/api/stock/${ batch }/deactivate`),
    activateBatch: (batch) => API().put(`/api/stock/${ batch }/activate`)
};