class ValidationService {

    validateEmail = (email) => email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    objectsAreEqual = (obj1, obj2) => {
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
            return false;
        }

        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }
    
        for (let key in obj1) {
            if (!this.objectsAreEqual(obj1[key], obj2[key])) {
                return false;
            }
        }
    
        return true;
    }
    
}

const validationService = new ValidationService();

export {validationService};