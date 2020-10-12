import API from "@/services/API";
export default {
  postLocation: (location) => API().post("/api/location", {location}),
  getLocations: () => API().get("/api/location"),
  getLocation: (id) => API().get(`/api/location/${id}`),
  putLocation: (location) => API().put(`/api/location/${location._id}`, {location}),
  deleteLocation: (id) => API().delete(`/api/location/${id}`),
};
