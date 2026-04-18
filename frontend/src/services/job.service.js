import api from './api';

export const getJobs = async (params = {}) => {
    try {
        const response = await api.get('/jobs', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch jobs" };
    }
};

export const getJobById = async (id) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Job not found" };
    }
};
