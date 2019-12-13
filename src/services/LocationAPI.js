import API from "@/services/API";
export default {
  postLocation(location) {
    return API().post("/api/location", {
      location
    });
  },
  getLocations() {
    return API().get("/api/location");
  },
  getLocation(id) {
    return API().get("/api/location/" + id);
  },
  putLocation(location) {
    return API().put("/api/location/" + location._id, {
      location
    });
  },
  deleteLocation(id) {
    return API().delete("/api/location/" + id);
  }
};
