import API from "@/services/API";

export default {
    postProtocol: (protocol) => API().post('/api/protocol', {protocol}),
    getAllProtocols: (params) => API().get('/api/protocol', {params}),
    getProtocol: (id) => API().get(`/api/protocol/${id}`),
    putProtocol: (protocol) => API().put(`/api/protocol/${protocol._id}`, {protocol}),
    deleteProtocol: (id) => API().delete(`/api/protocol/${id}`),
};
