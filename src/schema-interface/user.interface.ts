import { Document } from "mongoose"
import { CourseInterface } from "./course.interface"
import { RoleInterface } from "./role.interface"
import { TimeBankInterface } from "./timebank.interface"
import { UserInfoInterface } from "./userinfo.interface"

export interface UserInterface extends Document {
    email: string,
    username: string,
    password: string,
    roles: RoleInterface[],
    user_info: UserInfoInterface,
    time_bank: TimeBankInterface,
    courses: CourseInterface[],
    enrolled: {
        course: CourseInterface
        appointment_id: number
    }[]
}