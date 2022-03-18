import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Header from "./UI/Header"
import styles from './Dashboard.module.css';
export default function Dashboard () {
  const [currentWord, setCurrentWord] = useState("");
  const [currentWordJumbled, setCurrentWordJumbled] = useState("");
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('https://random-word-api.herokuapp.com/word?number=1')
      .then(response => response.json())
      .then(data => setCurrentWord(data));
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);
  useEffect(() => {
    if (currentWord.length > 0) {
      var a = currentWord.toString().split(""),
        n = a.length;
      for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      setCurrentWordJumbled(a.join(""));
    }
  }, [currentWord]);
  const [jumbledLetterList, setjumbledLetterList] = useState();
  var letterStyle = {
    padding: 10,
    margin: 10,
    backgroundColor: "#ffde00",
    color: "#ffffff",
    display: "inline-block",
    fontFamily: "monospace",
    fontSize: 32,
    textAlign: "center"
  };
  useEffect(() => {
    if (currentWordJumbled.length > 0) {
      var letterList = currentWordJumbled.split('').map(
        function (letter, index) {
          return <div style={letterStyle}>
            {letter}
          </div>;
        })
      setjumbledLetterList(letterList);
    }
  }, [currentWordJumbled]);

  const { currentUser } = useAuth()
  return (
    <>
      <Header />
      <div className={styles.game}>
        <div className={styles.jumbledLetters}>
          {jumbledLetterList}
        </div>
      </div>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            <strong>Email:</strong> {currentUser.email}
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
          </Card.Body>
        </Card></div>
    </>
  )
}
