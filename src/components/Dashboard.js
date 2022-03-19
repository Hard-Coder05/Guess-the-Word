import React, { useEffect, useState } from "react"
import { Button, Card, Row, Col } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Header from "./UI/Header"
import styles from './Dashboard.module.css';
export default function Dashboard () {
  const [score, setScore] = useState(400);
  const [level, setLevel] = useState("");
  const [win, setWin] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [currentWordJumbled, setCurrentWordJumbled] = useState([]);
  const [jumbledLetterComponentsList, setjumbledLetterComponentsList] = useState([]);
  const [currentUserAnswer, setCurrentUserAnswer] = useState([]);
  const [currentUserAnswerComponentList, setCurrentUserAnswerComponentList] = useState([]);

  // styling for letters
  var letterStyle = {
    padding: 10,
    margin: 10,
    backgroundColor: "#ffde00",
    color: "#ffffff",
    display: "inline-block",
    fontFamily: "monospace",
    fontSize: 32,
    textAlign: "center",
    cursor: "pointer",
  };

  function makeid (length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  useEffect(() => {
    setLevel("Beginner")
    if (win > 10)
      setLevel("Novice");
    if (win > 15)
      setLevel("Competence");
    if (win > 25)
      setLevel("Intermediate");
    if (win > 50)
      setLevel("Proficient");
    if (win > 100)
      setLevel("Expert");
    if (win > 200)
      setLevel("Wordly Godly");
    if (win > 300)
      setLevel("Champion");
    if (win > 500)
      setLevel("SLayer");
  }, [win]);

  // request to server to recieve the word
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('https://random-word-api.herokuapp.com/word?number=1')
      .then(response => response.json())
      .then(data => {
        setCurrentWord(data);
        setCurrentUserAnswer([]);
      });
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [win]);

  // jumble the word received
  useEffect(() => {
    if (currentWord.length > 0) {
      console.log(currentWord);
      var a = currentWord.toString();
      var b = makeid(16 - a.toString().length).toString();
      a = a.concat(b);
      a = a.split('');
      var n = a.length;
      for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      setCurrentWordJumbled(a);
    }
  }, [currentWord]);

  // create the list of letter components using jumbled letters 
  useEffect(() => {
    if (currentWordJumbled.length > 0) {
      var letterList = currentWordJumbled.map(
        function (letter, index) {
          return <Button style={letterStyle} onClick={
            () => {
              var dummyArray = currentUserAnswer.join('').concat(letter);
              console.log(dummyArray);
              setCurrentUserAnswer(dummyArray.split(''));
              currentWordJumbled.splice(index, 1);
              setCurrentWordJumbled([...currentWordJumbled]);
            }
          }>
            {letter}
          </Button>;
        })
      setjumbledLetterComponentsList(letterList);
    }
    else {
      setjumbledLetterComponentsList([]);
    }
  }, [currentWordJumbled]);


  useEffect(() => {
    if (currentUserAnswer.length > 0) {
      var letterList = currentUserAnswer.map(
        function (letter, index) {
          return <Button style={letterStyle} onClick={
            () => {
              var dummyArray = currentWordJumbled.join('').concat(letter);
              setCurrentWordJumbled(dummyArray.split(''));
              currentUserAnswer.splice(index, 1);
              setCurrentUserAnswer([...currentUserAnswer]);
            }
          }>
            {letter}
          </Button>;
        })
      setCurrentUserAnswerComponentList(letterList);
    }
    else {
      setCurrentUserAnswerComponentList([]);
    }
  }, [currentUserAnswer]);

  const { currentUser } = useAuth();

  const buttonClickHandler = () => {
    var userFinalAnswer = currentUserAnswer.join('');
    if (userFinalAnswer === currentWord.toString()) {
      setScore(score + 50);
      setWin(win + 1);
    }
    else {
      setWin(win - 1);
      setScore(score - 30);
    }
  }
  return (
    <>
      <Header />
      <hr className={styles.hrStyle} />
      <div className={styles.game}>
        <Row className={styles.gameStats}>
          <Col >
            User Score: {score}
          </Col>
          <Col >
            Level: {level}
          </Col>
          <Col >
            Wins till now: {win}
          </Col>
        </Row>
        {currentUserAnswer.length > 0 && <>
          <hr className={styles.hrStyle} />
          <div className={styles.title}>
            Your Answer
          </div>
          <div className={styles.userAnswer}>
            {currentUserAnswerComponentList}
          </div>
          <Button onClick={buttonClickHandler}>
            Check if Correct
          </Button>
        </>}
        {currentWordJumbled.length > 0 && <>
          <hr className={styles.hrStyle} />
          <div className={styles.title}>
            Remaining Letters
          </div>
          <div className={styles.jumbledLetters}>
            {jumbledLetterComponentsList}
          </div>
        </>}
      </div>
      {/* <hr className={styles.hrStyle} />
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            <strong>Email:</strong> {currentUser.email}
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
          </Card.Body>
        </Card>
      </div> */}
    </>
  )
}
