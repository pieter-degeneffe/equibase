import API from "@/services/API";

export default {
    postSemenCollection: (semenCollection) => API().post("/api/semen", {semenCollection}),
    getSemenCollection: (params) => API().get("/api/semen", {params}),
    putSemenCollection: (semenCollection) => API().put(`/api/semen/${semenCollection._id}`, {semenCollection}),
    deleteSemenCollection: (semenCollection) => API().delete(`/api/semen/${semenCollection._id}`),
    postSemenCollectionModification: (semenCollection, semenCollectionModification) => API().post(`/api/semen/${semenCollection._id}/modification`, {semenCollectionModification}),
    deleteSemenCollectionModification: (semenCollection, semenCollectionModification) => API().delete(`/api/semen/${semenCollection._id}/modification/${semenCollectionModification._id}`),
};
