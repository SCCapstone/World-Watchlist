import AboutComponent from "../components/AboutComponent";
import { team } from "../data/teamInfo";


function About() {
    return <div>
        <h3>About Us</h3>
        <AboutComponent teamMembers={team}></AboutComponent>
    </div>
}
export default About;