import API from '@/services/API';
export default {
    getMediniDelivery: () => API().get('/api/delivery/medini'),
};