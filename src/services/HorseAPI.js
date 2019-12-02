import API from "@/services/API";
export default {
  postHorse(horse) {
    return API().post("/api/horse", {
      name: horse // add our data to the request body
    });
  },
  getHorses() {
    return API().get("/api/horse");
  },
  getHorseCount() {
    return API().get("/api/horse/count");
  },
  getHorse(id) {
    return API().get("/api/horse/" + id);
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
