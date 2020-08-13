/*
    Connection with the api.
    Need to be running the backend first
*/

import axios from 'axios'

const PORT = process.env.PORT || 5000;

const api = axios.create({
    baseURL: `http://localhost:${PORT}/`
})

export const insertEvent = payload => api.post(`/events`, payload)
export const getAllEvents = () => api.get(`/events`)
export const getEventById = id => api.get(`/events/${id}`)
export const getAllAps = () => api.get('/aps')
export const getApByMac = mac => api.get(`/aps/${mac}`)
export const editdevice = payload => api.put(`/aps/${payload.apmac}/${payload.dmac}`, payload)


const apis = {
    insertEvent,
    getAllEvents,
    getEventById,
    getAllAps,
    getApByMac,
    editdevice
}

export default apis
