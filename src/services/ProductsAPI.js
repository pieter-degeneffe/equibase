import API from "@/services/API";
export default {
    getProduct() {
        return API().get("/api/product");
    }
};