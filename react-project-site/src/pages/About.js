import AboutComponent from "../components/AboutComponent";
import { team } from "../data/teamInfo";
import "../components/About.css"

function About() {
    return <div>
          <h2 id="about-title">About Us</h2>
        <AboutComponent teamMembers={team}></AboutComponent>
    </div>
}
export default About;