import API from "@/services/API";
export default {
  postNitrogenContainer: (nitrogenContainer) => API().post("/api/nitrogen-container", {nitrogenContainer}),
  getNitrogenContainers: (params) => API().get("/api/nitrogen-container", {params}),
  putLocation: (location) => API().put(`/api/location/${location._id}`, {location}),
  putNitrogenContainer: (nitrogenContainer) => API().put(`/api/nitrogen-container/${nitrogenContainer._id}`, {nitrogenContainer}),
  deleteNitrogenContainer: (id) => API().delete(`/api/nitrogen-container/${id}`),
};
