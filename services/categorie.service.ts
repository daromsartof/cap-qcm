import { API_URL } from "@/constants/Url"
import axiosClient from "./axio.service"
import { Categorie } from "@/types/Categorie"

const getAllCategories = async () : Promise<Categorie[]> => {
    try {
        return (await axiosClient.get(API_URL.CATEGORIE)).data
    } catch (error) {
        return []
    }
}

export { getAllCategories }