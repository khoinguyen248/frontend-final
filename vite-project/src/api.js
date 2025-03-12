import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
})

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token"); // Lưu token khi đăng nhập
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const getAlluser = () => API.get('/user/teachers')
export const getAlljobs = () => API.get('/user/teacher-positions')
export const addjobs = (data) => API.post('/user/teacher-positions', data)
export const addteacher = (data2) => API.post('/user/teachers', data2)

/*
export const signup = (data) => API.post('/account/signup', data)
export const signin = (data1 ) => API.post(`/account/signin`, data1)
export const getInfors = (email) => API.get(`/account/profile?email=${email}`)
export const jobs = () => API.get('/jobs/alljobs')
export const updateJobs = (data4) => API.post('/jobs/updateJobs', data4)
export const addEmployee = (data5) => API.post('/employees/addemployee', data5) */