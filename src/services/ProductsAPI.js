import API from "@/services/API";
export default {
    postProduct: (product) => API().post("/api/product", { product }),
    getAllProducts: () => API().get("/api/product"),
    getProduct: (id) => API().get(`/api/product/${ id }`),
    deleteProduct: (id) => API().delete("/api/product/" + id)
};