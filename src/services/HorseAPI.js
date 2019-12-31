import API from "@/services/API";
export default {
  postHorse(horse) {
    return API().post("/api/horse", {
      horse
    });
  },
  getHorses(type, death) {
    console.log(death + type);
    if (type && death) {
      return API().get("/api/horse", {
        params: {
          type: type,
          death: death
        }
      });
    } else if (!type && death) {
      return API().get("/api/horse", {
        params: {
          death: death
        }
      });
    }
    return API().get("/api/horse");
  },
  getHorseCount() {
    return API().get("/api/horse/count");
  },
  getHorse(id) {
    return API().get("/api/horse/" + id);
  },
  putHorse(horse) {
    console.log(' API update request received');
    return API().put("/api/horse/" + horse._id, {
      horse
    });
  },
  deleteHorse(id) {
    return API().delete("/api/horse/" + id);
  },
  postPassport(id, formData) {
    return API().post("/api/horse/" + id + "/passport",
      formData,
      {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      }
    )
  },
  deletePassport(horse) {
    return API().delete("/api/horse/" + horse._id + "/passport");
  }
};
