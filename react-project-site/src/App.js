import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import './App.css';
import Home from './pages/Home'
import { Navbar,Nav} from 'react-bootstrap'
import React from 'react'
import About from './pages/About'
import logo from './images/icon.png'
import Demo from './components/Demo';
import AppImages from './components/AppImages';
function App() {
  return (
    <html>
    <body>
    <div className="App">
      <Navbar className="nav" fixed="top" >
        <Nav className="mr-auto">
          <Nav.Link 
            onClick={() => scroller.scrollTo('Home', {
            smooth: true,
            offset: -70,
            duration: 500,
            })}
          >
            <img
              src={logo}
              width="28"
              height="28"
            />
          </Nav.Link>
          <Nav.Link onClick={() => scroller.scrollTo('Images', {
            smooth: true,
            offset: -70,
            duration: 500,
            })} id="navlink" >About</Nav.Link>
          <Nav.Link onClick={() => scroller.scrollTo('Demo', {
            smooth: true,
            offset: -70,
            duration: 500,
            })} id="navlink" >Demo</Nav.Link>
          <Nav.Link onClick={() => scroller.scrollTo('Team', {
            smooth: true,
            offset: -70,
            duration: 500,
            })} id="navlink" >Team</Nav.Link>
          <Nav.Link id="navlink" href="https://github.com/SCCapstone/World-Watchlist"
           target="_blank">Github</Nav.Link>
        </Nav>
      </Navbar>
      <div>
        <Element name="Home"><Home/></Element>
        <Element id="element" name="Images"><AppImages/></Element>
        <Element id="element" name="Demo"><Demo/></Element>
        <Element id="team-element" name="Team"><About/></Element>
      </div>  
    </div>
    </body>
    </html>

  );
}
export default App;
