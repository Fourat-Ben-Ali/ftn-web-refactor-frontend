import { FormControl } from "@angular/forms";
import { InputType } from "../Enumerations/InputType";

export interface formInputs
{
    label:string,
    type:InputType,
    placeholder?:string,
    icon?:string,
    className?:string,
    control:FormControl,
    errorMessages: { [key: string]: string }
}
