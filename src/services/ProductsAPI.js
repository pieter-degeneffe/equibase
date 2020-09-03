import API from "@/services/API";
export default {
    postProduct: (product) => API().post("/api/product", { product }),
    getAllProducts: () => API().get("/api/product"),
    deleteProduct(id) {
        return API().delete("/api/product/" + id);
    },
};