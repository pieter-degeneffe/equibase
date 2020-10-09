import API from "@/services/API";
export default {
  getSearch: (searchValue) => API().get(`/api/search/${searchValue}`),
  getSearchHorse: (searchValue) => API().get(`/api/search/horse/${searchValue}`),
  getSearchProduct: (searchValue) => API().get(`/api/search/product/${searchValue}`),
};
