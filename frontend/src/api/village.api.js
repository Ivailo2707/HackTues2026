import http from "../lib/http";
import { API_PATHS } from "../constants";

export const createVillage = async (data) => {
    const response = await http.post(API_PATHS.VILLAGES, data);
    return response.data;
};

export const getAllVillages = async () => {
    const response = await http.get(API_PATHS.VILLAGES);
    return response.data;
};

export const getVillageById = async (id) => {
    const response = await http.get(API_PATHS.VILLAGE_BY_ID(id));
    return response.data;
};

export const updateVillage = async (id, data) => {
    const response = await http.put(API_PATHS.VILLAGE_BY_ID(id), data);
    return response.data;
};

export const deleteVillage = async (id) => {
    await http.delete(API_PATHS.VILLAGE_BY_ID(id));
};