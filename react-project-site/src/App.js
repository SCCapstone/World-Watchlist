import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import './App.css';
import Home from './pages/Home'
import { Navbar,Nav} from 'react-bootstrap'
import React from 'react'
import logo from './images/icon.png'
function App() {
  return (
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
          <Nav.Link id="navlink" >About Us</Nav.Link>
          <Nav.Link id="navlink" >Demo</Nav.Link>
          <Nav.Link id="navlink" >Team</Nav.Link>
          <Nav.Link id="navlink" >Github</Nav.Link>
        </Nav>
      </Navbar>
      <div>
        <header className="App-header">
        <Element name="Home"><Home/></Element>
        </header>   
      </div>          
    </div>

  );
}
export default App;
