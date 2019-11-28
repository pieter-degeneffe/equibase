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
  getCustomer(id) {
    return API().get("/api/customer/" + id);
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
