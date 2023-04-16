import React, {useState} from "react";
import deck from './attempt.json';
import Grid2 from '@mui/material/Unstable_Grid2';
import {Button, ButtonGroup, TextField, Typography} from "@mui/material";

const Exam = () => {


    const [categories, setCategories] = useState(["Behavioral", "Biochemistry", "Biology",
        "Essential Equations", "General Chemistry", "Organic Chemistry", "Physics and Math"])

    function buttonPress(category) {
        if (categories.find(item => JSON.stringify(item) === JSON.stringify(category))) {
            const arr = categories.filter((item) => item !== category);
            setCategories(arr);
        } else {
            const arr = categories.slice();
            arr.push(category)
            setCategories(arr)
        }
    }


    const re = new RegExp("(::(.+).})|(::(.+).:|})");
    const removal = new RegExp("{{(c[0-9]::.+.)}}");
    const imageAdd = new RegExp("<img src=(.+)\">");

    function stripPrompt(prompt) {

        if (prompt.includes("img src")) {
            prompt = prompt.replace(removal, "[ANSWER]")
            prompt = prompt.replaceAll("{", "");
            prompt = prompt.replaceAll("}", "");
        } else {
            prompt = prompt.replace(removal, "[ANSWER]")

        }

        return prompt;
    }

    function getAnswer(ansList) {


        let curr = ""
        for (let i = 0; i < ansList.length; i++) {
            if (ansList[i] != null) {
                if (!ansList[i].includes("{") && !ansList[i].includes("}")
                    && !ansList.includes("<") &&
                    !ansList[i].includes(">")) {
                    if (ansList[i].includes(":")) {
                        curr = ansList[i].split(":")[0]
                    } else {
                        curr = ansList[i]
                    }
                }
            }
        }

        return curr;

    }


    function getQuestions() {
        let temp = []
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < deck.dataPull[i].notes.length; j++) {
                if (categories.find(item => JSON.stringify(item) === JSON.stringify(deck.dataPull[i].name))) {
                    const prompt = stripPrompt(deck.dataPull[i].notes[j].fields[0]);
                    let answerList = deck.dataPull[i].notes[j].fields[0].split(re)
                    let currentAnswer = getAnswer(answerList)
                    temp.push({prompt: prompt, answer: currentAnswer})
                }
            }
        }
        setQuestions(temp)

    }


    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({prompt: "", answer: ""});
    const [answer, setAnswer] = useState("");
    //const [isCorrect, setIsCorrect] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false); // Add a state variable to keep track of whether the answer should be shown
    const [image, setImage] = useState("");
    const [flag, setFlag] = useState(false)

    function moveQuestion(){
        const nextQuestionIndex = questions.indexOf(question) + 1;
        if (nextQuestionIndex < questions.length) {
            if (questions[nextQuestionIndex].prompt.includes("img src")) {
                let copyPrompt = questions[nextQuestionIndex].prompt.replaceAll("\"", "")
                    .replaceAll("<div>", "");
                console.log(copyPrompt)
                setFlag(true)
                copyPrompt = copyPrompt.split(imageAdd)[0].split(">")[0].split("=")[1]

                if(copyPrompt.includes("/ ")){
                    copyPrompt.replace("/ ", "")
                }
                setImage(require("./media/" + copyPrompt))
                setQuestion(questions[nextQuestionIndex]);
                setAnswer("")
            }
            else{
                setQuestion(questions[nextQuestionIndex]);
                setFlag(false)
                setAnswer("");
            }

        }
        randomizeQuestions();
        setShowAnswer(false);

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        try{
            if (answer.toLowerCase() === question.answer.toLowerCase()) {
                //setIsCorrect(true);
                moveQuestion()
                setAnswer("");

                // Hide the answer when moving on to the next question
            } else {
                //setIsCorrect(false);
                setAnswer("");
            }

        } catch{
            moveQuestion()
        }

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
                    <div dangerouslySetInnerHTML={{__html: question.prompt}}>

                    </div>
                    <div>
                        {flag && <img src={image} alt={"currentImage"} style={{width: "100%", maxWidth: 500}}/>}
                    </div>
                </Grid2>
                <Grid2 item xs={5} xl={5} spacing={10} style={{padding: 150}} container direction={"row"}>
                    <TextField label={"Answer"} onChange={(event) => setAnswer(event.target.value)}>
                    </TextField>
                    <Button type={"submit"} variant={"outlined"} size={"large"}
                            style={{maxWidth: '80px', maxHeight: '55px', minWidth: '80px', minHeight: '55px'}}
                            onClick={handleSubmit}>
                        Submit

                    </Button>
                    <Button type={"submit"} variant={"outlined"} size={"large"}
                            style={{maxWidth: '80px', maxHeight: '55px', minWidth: '80px', minHeight: '55px'}}
                            onClick={() => setShowAnswer(true)}>
                        Show Answer
                    </Button>
                    <Button type={"regenerate"} variant={"outlined"} size={"large"}
                            style={{maxWidth: '80px', maxHeight: '55px', minWidth: '80px', minHeight: '55px'}}
                            onClick={() => getQuestions()}>
                        Gen
                    </Button>
                    <Button onClick={() => {
                        moveQuestion()
                    }}>
                        Force Skip
                    </Button>
                    <Typography gutterBottom variant={"caption"}>
                        {showAnswer && <p style={{
                            color: 'red',
                            flex: 'content',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}></p>}
                        {showAnswer && <div dangerouslySetInnerHTML={{__html: question.answer}}></div>}

                        {showAnswer && <p style={{
                            color: 'red',
                            flex: 'content',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 10
                        }}>loser</p>}
                    </Typography>

                </Grid2>
            </Grid2>
            <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
                size={"large"}
            >
                <Button
                    variant={categories.find(item => JSON.stringify(item) === JSON.stringify("Behavioral")) ? "contained" : "outlined"}
                    onClick={() => buttonPress("Behavioral")}>Behavioral</Button>
                <Button
                    variant={categories.find(item => JSON.stringify(item) === JSON.stringify("Biochemistry")) ? "contained" : "outlined"}
                    onClick={() => buttonPress("Biochemistry")}>Biochemistry</Button>
                <Button
                    variant={categories.find(item => JSON.stringify(item) === JSON.stringify("Biology")) ? "contained" : "outlined"}
                    onClick={() => buttonPress("Biology")}>Biology</Button>
                <Button
                    variant={categories.find(item => JSON.stringify(item) === JSON.stringify("Essential Equations")) ? "contained" : "outlined"}
                    onClick={() => buttonPress("Essential Equations")}>Essential Equations</Button>
                <Button
                    variant={categories.find(item => JSON.stringify(item) === JSON.stringify("General Chemistry")) ? "contained" : "outlined"}
                    onClick={() => buttonPress("General Chemistry")}>General Chemistry</Button>
                <Button
                    variant={categories.find(item => JSON.stringify(item) === JSON.stringify("Organic Chemistry")) ? "contained" : "outlined"}
                    onClick={() => buttonPress("Organic Chemistry")}>Organic Chemistry</Button>
                <Button
                    variant={categories.find(item => JSON.stringify(item) === JSON.stringify("Physics and Math")) ? "contained" : "outlined"}
                    onClick={() => buttonPress("Physics and Math")}>Physics and Math</Button>
            </ButtonGroup>

        </div>);
};

export default Exam;



