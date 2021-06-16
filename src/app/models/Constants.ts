export class Constants{
    public static dateFormat1: string = "dd MMMM yyyy";
    public static dateFormat2: string = "dd/MM/yyyy";
    public static datePickerFormat: string = "DD/MM/yyyy";
    public static lang : string = "en";
    public static pattern = {
        alphabets :{
            regex: '^[a-zA-Z]+$',
            error: 'Must be alphabetic'
        },
        postalcode : {
            regex: '^[0-9]{6}$',
            error: 'Must be 6 digit numeric'
        },
        alphanumeric :{
            regex: '^[A-Za-z0-9\' ]+$',
            error: 'Must be alphanumeric'
        }
    };

}