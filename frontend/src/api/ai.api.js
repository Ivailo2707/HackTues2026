import http from "../lib/http";
import { API_PATHS } from "../constants";

export const sendAiMessage = async (prompt) => {
    const response = await http.post(API_PATHS.AI, prompt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
    return response.data;
};