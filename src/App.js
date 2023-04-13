import deck from './attempt.json';
import Exam from "./Exam";

function App() {

    console.log(deck.dataPull[0].notes[0].fields[0])
    return (
        <Exam/>
    );
}

export default App;
