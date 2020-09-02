import API from "@/services/API";
export default {
    postProduct(product) {
        return API().post("/api/product", {
            product
        });
    },
    getProduct() {
        return API().get("/api/product");
    },
    deleteProduct(id) {
        return API().delete("/api/product/" + id);
    },
};