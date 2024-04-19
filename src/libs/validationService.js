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

    determineTimePassed = (timeString) => {
        const sentTime = new Date(timeString);
        const currentTime = new Date();
    
        const timeDifference = currentTime - sentTime;
        const minutes = Math.floor(timeDifference / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30); // Approximating a month to 30 days
        const years = Math.floor(months / 12);
    
        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''} ago`;
        } else if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
    }
    
}

const validationService = new ValidationService();

export {validationService};