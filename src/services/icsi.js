import API from '@/services/API';

export default {
  postICSI(icsi) {
    return API().post('/api/icsi', {
      icsi
    });
  },
  deleteICSI(id) {
    return API().delete(`/api/icsi/${ id }`);
  },
  putICSI(icsi) {
    return API().put(`/api/icsi/${ icsi._id }`, {
      icsi
    });
  },
  getAllICSI(parameters) {
    return API().get('/api/icsi', {
      params: parameters
    });
  },
  getICSI(id) {
    return API().get(`/api/icsi/${ id }`);
  },
  getEmbryosByCustomer(id) {
    return API().get(`/api/customer/${ id }/embryos`);
  },
  getEmbryosByHorse(id) {
    return API().get(`/api/horse/${ id }/embryos`);
  }
};
