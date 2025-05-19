import { Roles } from "@kodevy-core-2.0/shared";

export type CustomRequest = {
    userId:string,
    email: string,
    roles: Roles[],
}