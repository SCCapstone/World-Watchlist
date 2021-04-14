import AboutComponent from "../components/AboutComponent";
import { team } from "../data/teamInfo";


function About() {
    return <div>
        <AboutComponent members={team}></AboutComponent>
    </div>
}
export default About;