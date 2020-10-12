import API from "@/services/API";
export default {
  postSemenCollection: (semenCol) => API().post("/api/semen", {semenCol}),
  getSemenCollection: (params) => API().get("/api/semen", {params}),
  putSemenCollection: (semenCol) => API().put(`/api/semen/${semenCol._id}`, {semenCol}),
  deleteSemenCollection: (semenCol) => API().delete(`/api/semen/${semenCol._id}`),
  postSemenCollectionModification: (semenCol, semenColMods) => API().post(`/api/semen/${semenCol._id}/modification`, { semenColMods}),
  deleteSemenCollectionModification: (semenCol, semenColMods) => API().delete(`/api/semen/${semenCol._id}/modification/${semenColMods._id}`),
};
