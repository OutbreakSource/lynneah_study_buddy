import React, {useState} from "react";
import deck from './pythonParse.json';
import Grid2 from '@mui/material/Unstable_Grid2';
import "./Exam.css";
import {Alert, Box, Button, ButtonGroup, Typography} from "@mui/material";

const Exam = () => {
    const channels = ['8YA825ZNAIE', 'jfKfPfyJRdk', 'e3L1PIY1pN8', "Q57Xz-38G_U"];
    const [channel, changeChannel] = useState("8YA825ZNAIE");
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({prompt: "", answer: ""});
    const [answer, setAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false); // Add a state variable to keep track of whether the answer should be shown
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState(["Behavioral", "Biochemistry", "Biology",
        "Essential Equations", "General Chemistry", "Organic Chemistry", "Physics and Math"])
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});
    const [incorrect, setIncorrect] = useState(true)
    const [loading, setLoading] = useState(false)
    const[buttonAns, setButtonAns] = useState([])




    function buttonPress(category) {
         if (categories.find(item => JSON.stringify(item) === JSON.stringify(category))) {
            const arr = categories.filter((item) => item !== category);
            setCategories(arr);
        } else {
            const arr = categories.slice();
            arr.push(category)
            setCategories(arr)
        }
        getQuestions()
    }

    function buttonPressAnswer(answer) {
        setAnswer(answer)
        if (buttonAns.find(item => JSON.stringify(item) === JSON.stringify(answer))) {
            const arr = buttonAns.filter((item) => item !== answer);
            setButtonAns(arr);
        } else {
            const arr = buttonAns.slice();
            arr.push(answer)
            setButtonAns(arr)
        }
    }

    function getQuestions() {
        let temp = []
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < deck.data[i].data.length; j++) {
                if (categories.find(item => JSON.stringify(item) === JSON.stringify(deck.data[i].name))) {
                    try{
                        let prompt = deck.data[i].data[j].text;
                        let answer = deck.data[i].data[j].answers[0];
                        if (require("./media/" + deck.data[i].data[j].image) == null){
                            temp.push({ prompt, answer});
                        }
                        else{
                            let image = (deck.data[i].data[j].image)
                            temp.push({ prompt, answer, image});
                        }

                    } catch{
                        console.log("stop reading the console nerd")
                    }

                }
            }
        }
        setQuestions(temp);
    }

    const [index, setIndex] = useState(null)

    function moveQuestion() {
        generateRandomNumber();
        setLoading(false);
        const nextQuestionIndex = questions.indexOf(question) + 1;
        if (nextQuestionIndex < questions.length) {
            // Update the image before setting the question state
            const nextQuestion = questions[nextQuestionIndex];
            const image = nextQuestion.image !== null ? require("./media/" + nextQuestion.image) : null;
            setImage(image);

            // Set the question and other states
            setQuestion(nextQuestion);
            setIndex(nextQuestionIndex);
            setAnswer("");
        }
        setShowAnswer(false);
        randomizeQuestions();
    }
    console.log(image)
    console.log(question)




    const handleSubmit = () => {
        try {
            setPopupPosition(getRandomPosition());
            if (answer.toLowerCase() === question.answer.toLowerCase()) {
                setIsCorrect(true);
                setTimeout(() => {
                    setIsCorrect(false);
                }, 3000);
                moveQuestion()

                // Hide the answer when moving on to the next question
            } else {
                setIncorrect(true);
                setTimeout(() => {
                    setIncorrect(false);
                }, 3000);
                setIsCorrect(false);
            }
        } catch {
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

    const getRandomPosition = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const x = Math.floor(Math.random() * (screenWidth - 100)) + 50;
        const y = Math.floor(Math.random() * (screenHeight - 100)) + 50;

        return {x, y};
    };


    function channelChange() {
        const randomIndex = Math.floor(Math.random() * channels.length);
        changeChannel(channels[randomIndex]);
    }

    function startRefresh(){
        getQuestions()
        setLoading(true)
    }
    const [ansIndex, setAnsIndex] = useState(null);

    const generateRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * 3);
        setAnsIndex(randomNumber);
    };

    function questionButton() {
        const steps = [];
        if (index != null) {
            for (let i = 0; i <= 3; i++) {
                if (i === ansIndex) {
                    steps.push(
                        <Button
                            key={i}
                            style={{ flex: 1 }}
                            variant={
                                buttonAns.find(
                                    (item) =>
                                        JSON.stringify(item) === JSON.stringify(question.answer)
                                )
                                    ? "outlined"
                                    : "contained"
                            }
                            onClick={() => buttonPressAnswer(question.answer)}
                        >
                            {question.answer}
                        </Button>
                    );
                } else {
                    steps.push(
                        <Button
                            key={i}
                            style={{ flex: 1 }}
                            variant={
                                buttonAns.find(
                                    (item) =>
                                        JSON.stringify(item) ===
                                        JSON.stringify(questions[index + i].answer)
                                )
                                    ? "outlined"
                                    : "contained"
                            }
                            onClick={() => buttonPressAnswer(questions[index + i].answer)}
                        >
                            {questions[index + i].answer}
                        </Button>
                    );
                }
            }
        }

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: "10px",
                    columnGap: "10px",
                    position: "sticky"
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {steps.slice(0, 2)}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {steps.slice(2)}
                </div>
            </div>
        );
    }


    return (
        // eslint-disable-next-line no-restricted-globals
        <div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh"
            }}>
                <Grid2 container direction={"column"} alignItems={"center"} justifyContent={"center"} spacing={3}>
                    {loading && <Alert severity="info">Press Force Skip after pressing start</Alert>}

                    <div style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <Grid2 item xs={8} xl={6}>

                            <text style={{color: '#FFFFFF', textShadow: '2px 2px #000000'}}>
                                Prompt:
                            </text>
                            <Box sx={{
                                border: 'none',
                                backgroundColor: '#FBF0D9',
                                opacity: 0.70,
                                overflow: "hidden",
                                width: 'auto',
                                height: 100,
                                maxHeight: 300,
                                whiteSpace: 'normal'  // set whiteSpace to normal
                            }}>
                                <div dangerouslySetInnerHTML={{__html: question.prompt}}></div>
                            </Box>

                        </Grid2>
                    </div>

                    <Box sx={{backgroundColor: '#FBF0D9', opacity: .70, borderRadius: 5}}>
                        <div style={{
                            width: 1600,
                            marginRight: "auto",
                            marginLeft: "auto",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            {image !== null && (
                                <Box style={{ position: "fixed", bottom: 250, right: "10%"}}>
                                    <img
                                        src={image}
                                        alt={"currentImage"}
                                        style={{ maxHeight: "250px", maxWidth: "500"}}
                                    />
                                </Box>
                            )}

                            <Grid2 item xs={5} xl={5} spacing={10} style={{padding: 150}} container direction={"row"}
                                   >
                                {isCorrect && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: `${popupPosition.y}px`,
                                            left: `${popupPosition.x}px`,
                                            backgroundColor: "yellow",
                                            padding: "10px",
                                            borderRadius: "15px",
                                            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                                            opacity: "0.3",
                                            transform: "opacity 2s 5s, padding 3s"
                                        }}>
                                    </div>
                                )}
                                {incorrect && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: `${popupPosition.y}px`,
                                            left: `${popupPosition.x}px`,
                                            backgroundColor: "yellow",
                                            padding: "10px",
                                            borderRadius: "15px",
                                            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                                            opacity: "0.3",
                                            transform: "opacity 2s 5s, padding 3s"
                                        }}>
                                    </div>
                                )}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "15vh"

                                }}>
                                    <Button type={"submit"} variant={"outlined"} size={"large"} style={{
                                        maxWidth: '80px',
                                        maxHeight: '55px',
                                        minWidth: '80px',
                                        minHeight: '55px'
                                    }} onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    <Button type={"showAns"} variant={"outlined"} size={"large"} style={{
                                        maxWidth: '80px',
                                        maxHeight: '55px',
                                        minWidth: '80px',
                                        minHeight: '55px'
                                    }} onClick={() => setShowAnswer(true)}>
                                        Show Answer
                                    </Button>
                                    <Button variant="outlined" size={"large"} style={{
                                        maxWidth: '80px',
                                        maxHeight: '55px',
                                        minWidth: '80px',
                                        minHeight: '55px',
                                        color: "red"
                                    }} onClick={moveQuestion}>
                                        Force Skip
                                    </Button>
                                </div>
                                <Box style={{ position: "relative" }}>
                                    <Typography gutterBottom variant="caption">
                                        {showAnswer && (
                                            <div
                                                dangerouslySetInnerHTML={{ __html: question.answer }}
                                                style={{
                                                    backgroundColor: "darkcyan",
                                                    borderRadius: 4,
                                                    padding: 10,
                                                    marginBottom: 10,
                                                    fontSize: 16,
                                                    lineHeight: 1.5
                                                }}
                                            />
                                        )}
                                        {showAnswer && (
                                            <p
                                                style={{
                                                    color: "red",
                                                    fontSize: 10,
                                                    textAlign: "center",
                                                    margin: "auto"
                                                }}
                                            >
                                                loser
                                            </p>
                                        )}
                                    </Typography>

                                </Box>


                            </Grid2>
                            <ButtonGroup
                                disableElevation
                                variant="contained"
                                aria-label="Disabled elevation buttons"
                                size="large"
                                style={{
                                    position: "fixed",
                                    top: "68%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {questionButton()}
                            </ButtonGroup>
                        </div>
                    </Box>
                </Grid2>
                <div className={"button-group-container"}>
                    <ButtonGroup
                        disableElevation
                        variant="contained"
                        aria-label="Disabled elevation buttons"
                        size={"large"}
                        sx={{backgroundColor: "0044E7FF"}}
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
                </div>

                <div style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <iframe title={"dini"} width="400" height="225"
                            src={"https://www.youtube.com/embed/" + channel + "?autoplay=1&mute=1"}
                            allow='autoplay; encrypted-media' style={{margin: '0 auto'}}></iframe>
                    <Button variant={"contained"} style={{marginTop: '10px', color: "lightblue"}}
                            onClick={() => channelChange()}>Change Channel</Button>
                </div>
            </div>
            <div>
                <Button variant={"contained"} style={{ position: 'absolute', bottom: 150, left: '50%', transform: 'translateX(-50%)'
                }} onClick={() => startRefresh()}>
                    Start
                </Button>
            </div>

        </div>)
};

export default Exam;



