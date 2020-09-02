import API from "@/services/API";
export default {
    getProduct() {
        return API().get("/api/product");
    },
    deleteProduct(id) {
        return API().delete("/api/product/" + id);
    }
};