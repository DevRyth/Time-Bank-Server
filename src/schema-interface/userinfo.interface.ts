import { Document } from "mongoose";

export interface UserInfoInterface extends Document {
    first_name: string,
    middle_name?: string,
    last_name: string,
    gender: string,
    birth_date: number,
    birth_month: number,
    birth_year: number,
    address: string,
    district: string,
    state: string,
    pincode: number,
    phone_number: number
}