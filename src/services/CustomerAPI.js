import API from "@/services/API";
export default {
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
};
