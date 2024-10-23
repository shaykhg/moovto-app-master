import {Icon} from "./Icon";

export interface Vehicle {
    _id: string;
    name: string;
    max_distance: number;
    max_charges: number;
    tooltip: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    id: string;
    min_charges: number;
    icon: Icon;
    name_fi: string;
}
