import { Document } from "mongoose";

export interface AppointmentInterface extends Document {
    start: string,
    duration: string,
    day: string
}