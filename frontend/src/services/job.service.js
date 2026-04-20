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

export const createJob = async (jobData) => {
    try {
        const response = await api.post('/jobs', jobData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to create job" };
    }
};

export const updateJob = async (id, jobData) => {
    try {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update job" };
    }
};

export const deleteJob = async (id) => {
    try {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete job" };
    }
};
