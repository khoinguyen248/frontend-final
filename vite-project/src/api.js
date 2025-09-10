import axios from 'axios'

const API = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
        'Content-Type': 'application/json'
    }
})



export const search = (data2) => API.post('/search/collection', data2)
export const searchinfo = (data3) => API.post('/search/infoframes', data3)

/*
export const signup = (data) => API.post('/account/signup', data)
export const signin = (data1 ) => API.post(`/account/signin`, data1)
export const getInfors = (email) => API.get(`/account/profile?email=${email}`)
export const jobs = () => API.get('/jobs/alljobs')
export const updateJobs = (data4) => API.post('/jobs/updateJobs', data4)
export const addEmployee = (data5) => API.post('/employees/addemployee', data5)


export const getAlluser = () => API.get('/teachers')
export const getAlljobs = () => API.get('/positions')
export const addjobs = (data) => API.post('/positions', data)
export const addteacher = (data2) => API.post('/teachers', data2)
*/