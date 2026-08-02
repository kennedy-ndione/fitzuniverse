class EligibilityEngine{

constructor(questions){

this.questions = questions;

this.current = 0;

this.answers = {};

}

getCurrentQuestion(){

return this.questions[this.current];

}

saveAnswer(questionId,value){

this.answers[questionId] = value;

}

next(){

if(this.current < this.questions.length-1){

this.current++;

return true;

}

return false;

}

previous(){

if(this.current>0){

this.current--;

}

}

getProgress(){

return Math.round(

((this.current+1)/this.questions.length)*100

);

}

}
