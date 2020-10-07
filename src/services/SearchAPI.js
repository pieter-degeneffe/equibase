import API from "@/services/API";
export default {
  getSearch: (id) => API().get("/api/search/" + id),
};
