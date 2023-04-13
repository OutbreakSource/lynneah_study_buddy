import React, { useState } from "react";
import deck from './attempt.json';
import Grid2 from '@mui/material/Unstable_Grid2';
import {Button, TextField, Typography} from "@mui/material";

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
            const nextQuestionIndex = questions.indexOf(question) + 1;
            if (nextQuestionIndex < questions.length) {
                setQuestion(questions[nextQuestionIndex]);
                setIsCorrect(false);
                setAnswer("");

            }
            randomizeQuestions();
            setShowAnswer(false); // Hide the answer when moving on to the next question
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



    return (
        <div style={{margin: 160, padding: 50}}>
            <Grid2 container direction={"column"} alignItems={"center"} spacing={5}>
                <Grid2 item xs={8} xl={5}>
                    <div dangerouslySetInnerHTML={{__html: question.prompt}}></div>
                </Grid2>
                <Grid2 item xs={5} xl={5} spacing={10} style={{padding:150}} container direction={"row"}>
                    <TextField label={"Answer"} onChange={(event) => setAnswer(event.target.value)}>
                    </TextField>
                    <Button type={"submit"} variant={"outlined"} size={"large"}
                            style={{maxWidth: '80px', maxHeight: '55px', minWidth: '80px', minHeight: '55px'}}
                            onClick={handleSubmit}>
                        Submit
                        {isCorrect && <p>Correct!</p>}
                    </Button>
                    <Button type={"submit"} variant={"outlined"} size={"large"}
                            style={{maxWidth: '80px', maxHeight: '55px', minWidth: '80px', minHeight: '55px'}}
                            onClick={() => setShowAnswer(true)}>
                        Show Answer
                        {isCorrect && <p>Correct!</p>}
                    </Button>
                    <Typography gutterBottom variant={"caption"}>
                        {showAnswer && <p style={{color: 'red', flex: 'content',display: 'flex', justifyContent: 'center', alignItems:'center'
                        }}>The correct answer is {question.answer}</p>}
                        {showAnswer && <p style={{color: 'red', flex: 'content',display: 'flex', justifyContent: 'center', alignItems:'center',
                            fontSize:10
                        }}>loser</p>}
                    </Typography>
                </Grid2>
            </Grid2>
        </div>);
};

export default Exam;



