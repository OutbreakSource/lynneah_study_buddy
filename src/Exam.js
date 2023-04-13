import React, { useState, useEffect } from "react";
import deck from './attempt.json';

const Exam = () => {

    const re = new RegExp("::([A-Z|a-z| |[0-9].[a-z|A-Z]*)")


    let arr = []
    for(let i = 0; i < 7; i++){
        for(let j = 0; j < deck.dataPull[i].notes.length; j++){
            arr.push({prompt: deck.dataPull[i].notes[j].fields[0].replaceAll(deck.dataPull[i].notes[j].fields[0].split(re)[1], "..."), answer: deck.dataPull[i].notes[j].fields[0].split(re)[1]})
        }
    }


    const [questions, setQuestions] = useState(arr);
    const [question, setQuestion] = useState({ prompt: "", answer: "" });
    const [answer, setAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false); // Add a state variable to keep track of whether the answer should be shown


    const handleSubmit = (event) => {
        event.preventDefault();

        if (answer.toLowerCase() === question.answer.toLowerCase()) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }

        setAnswer("");
    };

    const randomizeQuestions = () => {
        // Create a copy of the questions array and shuffle it using the Fisher-Yates algorithm
        const shuffledQuestions = [...questions];
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }
        setQuestions(shuffledQuestions);
    };

    useEffect(() => {
        randomizeQuestions();
        setQuestion(questions[0]);

        // When the component unmounts, stop the stopwatch
    }, [questions, randomizeQuestions]);

    useEffect(() => {
        // When the user's answer is correct, move on to the next question and randomize the questions
        if (isCorrect) {
            const nextQuestionIndex = questions.indexOf(question) + 1;
            if (nextQuestionIndex < questions.length) {
                setQuestion(questions[nextQuestionIndex]);
                setIsCorrect(false);
            }
            randomizeQuestions();
            setShowAnswer(false); // Hide the answer when moving on to the next question

        }
    }, [isCorrect, question, questions, randomizeQuestions]);


    return (
        <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', verticalAlign:  'middle', textAlign:'center', paddingTop:200}}>
            <form onSubmit={handleSubmit}>
                <div dangerouslySetInnerHTML={{__html: question.prompt}}></div>
                <input type="text" value={answer} onChange={(event) => setAnswer(event.target.value)} />
                <button type="submit">Submit</button>
                {isCorrect && <p>Correct!</p>}
                <button type="button" onClick={() => setShowAnswer(true)}>Show Answer</button>

            </form>
            {/* Render the answer only if the button has been clicked */}
            <div>
                {showAnswer && <p >The correct answer is {question.answer}</p>}
            </div>

        </div>);
};

export default Exam;



