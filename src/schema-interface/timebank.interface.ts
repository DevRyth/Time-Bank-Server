import { Document } from "mongoose";

export interface TimeBankInterface extends Document {
    time: number,
    usedTime: number,
    earnedTime: number
}