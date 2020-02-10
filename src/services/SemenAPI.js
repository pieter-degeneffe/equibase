import API from "@/services/API";
export default {
  getSemenCollection(parameters) {
    return API().get("/api/semen", {
      params: parameters
    });
  },
  postSemenCollection(semenCollection) {
    return API().post("/api/semen", {
      semenCollection
    });
  },
  postSemenCollectionModification(semenCollection, semenCollectionModification) {
    return API().post("/api/semen/" + semenCollection._id + "/modification", {
      semenCollectionModification
    });
  },
};
