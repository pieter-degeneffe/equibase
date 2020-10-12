import API from "@/services/API";
export default {
  postCustomer: (customer) => API().post("/api/customer", {customer}),
  getCustomers: (params) => API().get("/api/customer", {params}),
  getCustomerSearch: (id) => API().get(`/api/customer/search/${id}`),
  getCustomer: (id) => API().get(`/api/customer/${id}`),
  getCustomerHorses: (id, params) => API().get(`/api/customer/${id}/horse`, {params}),
  putCustomer: (customer) => API().put(`/api/customer/${customer._id}`, {customer}),
  deleteCustomer: (id) => API().delete(`/api/customer/${id}`),
  addContact: (customer, contact) => API().post(`/api/customer/${customer._id}/contact`, {contact}),
  updateContact: (customer, contact) => API().put(`/api/customer/${customer._id}/contact/${contact._id}`, {contact}),
  deleteContact: (customer, contact) => API().delete("/api/customer/" + customer._id + "/contact/" + contact._id)
};
