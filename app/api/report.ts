import { Report } from "../navigation/types"
import axiosInstance from "./axiosInstance"

export const postReport = async(formData: Report)=>{
    const res = await axiosInstance.post(`/report/create-report`,formData)
    return res.data
}