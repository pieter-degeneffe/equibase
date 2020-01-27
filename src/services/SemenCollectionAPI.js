import API from "@/services/API";
export default {
  getSemenCollection(parameters) {
    return API().get("/api/semen-collection", {
      params: parameters
    });
  },
  postSemenCollection(semenCollection) {
    return API().post("/api/semen-collection", {
      semenCollection
    });
  },
};
