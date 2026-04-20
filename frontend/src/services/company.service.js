import api from './api';

export const getCompanies = async () => {
    try {
        const response = await api.get('/companies');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch companies" };
    }
};

export const createCompany = async (companyData) => {
    try {
        const response = await api.post('/companies', companyData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to create company" };
    }
};
