import API from "@/services/API";
export default {
  getSearch: (id) => API().get(`/api/search/${id}`),
  getSearchHorse: (id) => API().get(`/api/search/horse/${id}`),
  getSearchProduct: (id) => API().get(`/api/search/product/${id}`),
};
