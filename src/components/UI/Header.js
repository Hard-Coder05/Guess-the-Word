import React, { Fragment, useState } from 'react'
import headerImage from '../../assets/headerImage.jpg';
import classes from './Header.module.css';
import { Button, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
export default function Header () {
  const { logout } = useAuth()
  const history = useHistory()
  const [error, setError] = useState("")
  async function handleLogout () {
    setError("")
    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }
  return (
    <Fragment>
      <header className={classes.header}>
        <div className='Level'>Level 1</div>
        <h1>Word Game</h1>
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </header>
      <div className={classes['main-image']}>
        <img src={headerImage} alt='A word game' />
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
    </Fragment>
  );
};