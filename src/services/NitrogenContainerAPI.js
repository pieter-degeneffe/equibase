import API from "@/services/API";
export default {
  postNitrogenContainer(nitrogenContainer) {
    return API().post("/api/nitrogen-container", {
      nitrogenContainer
    });
  },
  getNitrogenContainers(parameters) {
    return API().get("/api/nitrogen-container", {
      params: parameters
    });
  },
  putLocation(location) {
    return API().put("/api/location/" + location._id, {
      location
    });
  },
  putNitrogenContainer(nitrogenContainer) {
    return API().put("/api/nitrogen-container/" + nitrogenContainer._id, {
      nitrogenContainer
    });
  },
  deleteNitrogenContainer(id) {
    return API().delete("/api/nitrogen-container/" + id);
  }
};
