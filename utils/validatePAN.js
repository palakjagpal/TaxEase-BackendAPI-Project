// The validatePAN function checks if the provided PAN (Permanent Account Number) is valid based on the standard format.
export const validatePAN = (pan) => {
    if (!pan) 
        return false;

    const value = String(pan).toUpperCase().trim();

    // PAN format: 5 letters, followed by 4 digits, and ending with 1 letter (e.g., ABCDE1234F)
    //$/ is the end of the string, ^ is the start of the string, [A-Z]{5} matches 5 uppercase letters, [0-9]{4} matches 4 digits, and [A-Z]{1} matches 1 uppercase letter.
    //test(value) method checks if the value matches the specified regular expression pattern and returns true or false accordingly.
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
};