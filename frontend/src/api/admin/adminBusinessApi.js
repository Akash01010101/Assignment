import axiosClient from '../axiosClient';

export const getBusinessApplications = async () => {
  const response = await axiosClient.get('/admin/business-applications');
  return response.data;
};

export const approveBusiness = async (id) => {
  const response = await axiosClient.put(`/admin/business-applications/${id}/approve`);
  return response.data;
};

export const rejectBusiness = async (id) => {
  const response = await axiosClient.put(`/admin/business-applications/${id}/reject`);
  return response.data;
};
