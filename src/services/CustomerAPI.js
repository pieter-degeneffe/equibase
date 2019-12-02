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
  }
};
