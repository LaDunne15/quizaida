class ValidationService {
    //generateSixDigitCode = () => Math.floor(Math.random() * 900000) + 100000;

    validateEmail = (email) =>email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
      
    
}

const validationService = new ValidationService();

export {validationService};