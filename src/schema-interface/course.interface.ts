import { Document } from "mongoose";
import { AppointmentInterface } from "./appointment.interface";
import { UserInterface } from "./user.interface";

export interface CourseInterface extends Document {
    title: string,
    summary: string,
    description: string,
    difficulty: string,
    creator: UserInterface,
    schedule: {
        appointment: AppointmentInterface,
        availability: boolean,
        isEnrolled: boolean
    }[]
}