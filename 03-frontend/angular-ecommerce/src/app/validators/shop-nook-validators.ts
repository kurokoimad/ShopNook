import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopNookValidators
{
     // whitespace validation-check
     static notOnlyWhitespace(control: FormControl) : ValidationErrors | null {
        
        // checking if it only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) 
        {
            // not valid, return error 
            return { 'notOnlyWhitespace': true };
        }
        else 
        {
            // return null if it is valid
            return null;
        }
    }

}
