import API from "@/services/API";
export default {
  postSemenCollection(semenCollection) {
    return API().post("/api/semen", {
      semenCollection
    });
  },
  getSemenCollection(parameters) {
    return API().get("/api/semen", {
      params: parameters
    });
  },
  putSemenCollection(semenCollection) {
    return API().put("/api/semen/" + semenCollection._id, {
      semenCollection
    });
  },
  deleteSemenCollection(semenCollection) {
    return API().delete("/api/semen/" + semenCollection._id);
  },
  postSemenCollectionModification(semenCollection, semenCollectionModification) {
    return API().post("/api/semen/" + semenCollection._id + "/modification", {
      semenCollectionModification
    });
  },
  deleteSemenCollectionModification(semenCollection, semenCollectionModification) {
    return API().delete("/api/semen/" + semenCollection._id + "/modification/" + semenCollectionModification._id);
  },
};
