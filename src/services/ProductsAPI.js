import API from "@/services/API";
export default {
    postProduct: (product) => API().post("/api/product", { product }),
    getAllProducts: () => API().get("/api/product"),
    getProduct: (id) => API().get(`/api/product/${ id }`),
    getConfig: () => API().get('/api/product/config'),
    putProduct: (product) => API().put(`/api/product/${ product._id }`, { product }),
    deleteProduct: (id) => API().delete("/api/product/" + id)
};