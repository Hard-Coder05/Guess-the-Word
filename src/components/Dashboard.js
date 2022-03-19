import React, { useEffect, useState } from "react"
import { Button, Card, Row, Col } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Header from "./UI/Header"
import styles from './Dashboard.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Dashboard () {
  const [score, setScore] = useState(600);
  const [level, setLevel] = useState("");
  const [win, setWin] = useState(0);
  const [round, setRound] = useState(3);
  const [computerPoints, setComputerPoints] = useState(600);
  const [currentWord, setCurrentWord] = useState("");
  const [currentWordJumbled, setCurrentWordJumbled] = useState([]);
  const [jumbledLetterComponentsList, setjumbledLetterComponentsList] = useState([]);
  const [currentUserAnswer, setCurrentUserAnswer] = useState([]);
  const [currentUserAnswerComponentList, setCurrentUserAnswerComponentList] = useState([]);
  const [isUserAnswerValid, setUserAnswerValid] = useState(false);

  // styling for letters
  var letterStyle = {
    padding: 10,
    margin: 10,
    width: "20%",
    backgroundColor: "#ffde00",
    color: "#ffffff",
    display: "inline-block",
    fontFamily: "monospace",
    fontSize: 32,
    textAlign: "center",
    cursor: "pointer",
  };
  var letterStyle2 = {
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
    for (var i = 0; i < length; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
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
    if (round === 0) {
      setRound(3);
      if (computerPoints <= score)
        setWin(win + 1);
      setComputerPoints(600);
      setScore(600);
    }
  }, [round]);

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
          return <Button style={letterStyle2} onClick={
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

  async function buttonClickHandler () {
    var userFinalAnswer = currentUserAnswer.join('');
    var url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    url = url.concat(userFinalAnswer.toString());
    const response = await fetch(url);
    const data = await response.json();
    if (userFinalAnswer.toString() === currentWord.toString()) {
      setScore(score + 20 * (userFinalAnswer.length));
      setComputerPoints(computerPoints - 20 * (userFinalAnswer.length));
      setRound(round - 1);
      toast("Congratulations!! You entered the next round");
    }
    else if (Array.isArray(data) && data[0].word === userFinalAnswer.toString()) {
      if (userFinalAnswer.length > currentWord.toString().length) {
        setScore(score + 20 * (userFinalAnswer.length));
        setComputerPoints(computerPoints - 20 * (userFinalAnswer.length));
        setRound(round - 1);
        toast("Congratulations!! You entered the next round");
      }
      else {
        setScore(score - 20 * (currentWord.length));
        setComputerPoints(computerPoints + 20 * (currentWord.length));
        setRound(round - 1);
        toast("Sorry!! Computer had a longer word in head which is " + currentWord.toString().toUpperCase());
      }
    }
    else {
      setScore(score - 20 * (currentWord.length));
      setComputerPoints(computerPoints + 20 * (currentWord.length));
      setRound(round - 1);
      toast("Heyy! Type in a meaningfull word next time. The answer was: " + currentWord.toString().toUpperCase());
    }
  }
  return (
    <>
      <Header />
      <hr className={styles.hrStyle} />
      <Button onClick={() => {
        toast("Tap on the letters to form your answer. You can edit your answer by again tapping back. Fight with computer to reach next level.");
      }}>
        How to Play?
      </Button>
      <hr className={styles.hrStyle} />
      <Row className={styles.gameStats}>
        <Col >
          Hi {currentUser.email} !!!
        </Col>
        <Col >
          Computer Health: {computerPoints}
        </Col>
      </Row>
      <hr className={styles.hrStyle} />
      <div className={styles.game}>
        <ToastContainer />
        <Row className={styles.gameStats}>
          <Col >
            User Health: {score}
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
          <Row>
            <Col>
              <Button onClick={buttonClickHandler}>
                Attack Computer
              </Button>
            </Col>
            <Col>
              <Button onClick={() => {
                setScore(score - 20 * (currentWord.toString().length));
              }}>
                Skip
              </Button>
            </Col>
          </Row>

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
