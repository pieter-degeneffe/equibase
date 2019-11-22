import API from "@/services/API";
export default {
  postHorse(horse) {
    return API().post("/api/horse", {
      name: horse // add our data to the request body
    });
  },
  getCustomers() {
    return API().get("/api/customer");
  },
  getCustomer(id) {
    return API().get("/api/customer/" + id);
  },
  putHorse(horse) {
    return API().put("/api/horse/" + horse._id, {
      horse
    });
  },
  deleteHorse(id) {
    return API().delete("/api/horse/" + id);
  }
};
