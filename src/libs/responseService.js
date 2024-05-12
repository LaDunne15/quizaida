class ResponseService {

    getTotalResult = (response) => {
        
        const result = response.answers.sort((a,b)=>{return (a.orderNumber-b.orderNumber);}).map(i=>{
            return {...i, rating: this.getAmswerResult(i)};
        });          
            
        return {
            ...response, 
            answers: result,
            total: result.length ?( result.map(i=>i.rating).reduce((acc,val) => acc + val) / response.answers.length * 100 ).toFixed(0):0
        }
    }

    getAmswerResult = (i) => {

        if(i.question.type==="radio") {
            return i.question.correctAnswers[0].id === i.answers[0]?1:0;
        } else {
            const ans = i.question.answer.map(i=>({correct:i.correct,id:i.id}));
            const ans2 = i.answers;
            const res = ans.map(i=>i.correct?(ans2.includes(i.id)?1:0):(!ans2.includes(i.id)?1:0));

            if (res.length) { 
                return res.reduce((acc,val) => acc + val)/res.length;
            } else {
                return 0;
            }
        }
    }



} 

const responseService = new ResponseService();

export { responseService };