import API from "@/services/API";
export default {
  getSearch(id) {
    return API().get("/api/search/" + id);
  },
};
