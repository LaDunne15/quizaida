class GenerationService {

    generateSixDigitCode = () => Math.floor(Math.random() * 900000) + 100000;

    hashPassword = (pass, saltRounds = 10) => {
        try {
            return bcrypt.hashSync(pass, saltRounds);
        } catch (error) {
            //console.error('Password hashing failed:', error);
            throw 'Password hashing failed';
        }
    };
    
}

const generationService = new GenerationService();

export {generationService};