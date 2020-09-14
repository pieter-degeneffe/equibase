import API from "@/services/API";
export default {
    postProduct: (product) => API().post('/api/product', { product }),
    getAllProducts: () => API().get('/api/product'),
    getProduct: (id) => API().get(`/api/product/${ id }`),
    putProduct: (product) => API().put(`/api/product/${ product._id }`, { product }),
    deleteProduct: (id) => API().delete(`/api/product/${id}`),
    searchProduct: (searchValue) => API().get( `/api/product/${ searchValue }`)
};
