import appInfo from '../data/appInfo.js';
import './Home.css';
import {Container,Row,Col} from 'react-bootstrap'
function Home() {
    let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]); 
    let features = zip(appInfo["WhatFor"]["body"], appInfo["WhatFor"]["icon"]);
    let body = features.map((item)=> {return<Col> {item[1]} <p id="paragraph">{item[0]}</p></Col>});
    return (<div className="home">
                <h2 id="title">{appInfo["WhatIs"]["header"]}</h2>
                <p id="first-body">{appInfo["WhatIs"]["body"]}</p>
                <div className="features" >
                    <h2 id="feature-header">{appInfo["WhatFor"]["header"]}</h2>
                    <Container id="list-features">
                            <Row>
                            {body}
                            </Row>
                    </Container>
                </div>
            </div>);
}
export default Home;