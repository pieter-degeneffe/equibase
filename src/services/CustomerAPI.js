import API from "@/services/API";
export default {
  postCustomer(customer) {
    return API().post("/api/customer", {
      customer
    });
  },
  getCustomers() {
    return API().get("/api/customer");
  },
  getCustomerSearch(id) {
    return API().get("/api/customer/search/" + id);
  },
  getCustomerCount() {
    return API().get("/api/customer/count");
  },
  getCustomer(id) {
    return API().get("/api/customer/" + id);
  },
  getCustomerHorses(id) {
    return API().get("/api/customer/" + id + "/horse");
  },
  putCustomer(customer) {
    return API().put("/api/customer/" + customer._id, {
      customer
    });
  },
  deleteCustomer(id) {
    return API().delete("/api/customer/" + id);
  },
  addContact(customer, contact) {
    return API().post("/api/customer/" + customer._id + "/contact", {
      contact
    });
  },
  updateContact(customer, contact) {
    return API().put("/api/customer/" + customer._id + "/contact/" + contact._id, {
      contact
    });
  },
  deleteContact(customer, contact) {
    return API().delete("/api/customer/" + customer._id + "/contact/" + contact._id);
  }
};
