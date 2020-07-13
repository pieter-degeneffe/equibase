import API from '@/services/API';

export default {
  postICSI: (icsi) => API().post('/api/icsi', { icsi }),
  deleteICSI: (id) => API().delete(`/api/icsi/${ id }`),
  getAllICSI: (parameters) => API().get('/api/icsi', { params: parameters }),
  getICSI: (id) => API().get(`/api/icsi/${ id }`),
  putICSI: (icsi) => API().put(`/api/icsi/${ icsi._id }`, { icsi }),
  getAvailableEmbryos: () => API().get('/api/icsi/embryos?active=true'),

  transferEmbryo: (data) => API().post('/api/icsi/transfer', data),
  exportEmbryo: (data) => API().post('/api/icsi/export', data),

  getEmbryosByCustomer: (id, parameters) => API().get(`/api/customer/${ id }/embryos`, { params: parameters }),

  getEmbryosByHorse: (id, parameters) => API().get(`/api/horse/${ id }/embryos`, { params: parameters }),
};
