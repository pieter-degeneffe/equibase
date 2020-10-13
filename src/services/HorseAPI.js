import API from "@/services/API";

export default {
    postHorse: (horse) => API().post("/api/horse", {horse}),
    getHorses: (params) => API().get("/api/horse", {params}),
    getHorseCount: () => API().get("/api/horse/count"),
    getHorse: (id) => API().get(`/api/horse/${id}`),
    putHorse: (horse) => API().put(`/api/horse/${horse._id}`, {horse}),
    deleteHorse: (id) => API().delete(`/api/horse/${id}`),
    postPassport: (id, formData) => API().post(`/api/horse/${id}/passport`, formData, {headers: {'Content-Type': 'multipart/form-data'}}),
    deletePassport: (horse) => API().delete(`/api/horse/${horse._id}/passport`),
    postLodging: (horse) => API().post(`/api/horse/${horse._id}/lodging`, {horse}),
    deleteLodging: (horse, lodging) => API().delete(`/api/horse/${horse._id}/lodging/${lodging._id}`)
}
