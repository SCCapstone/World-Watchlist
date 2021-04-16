import {Container,Row,Col} from 'react-bootstrap'

function AboutComponent({teamMembers}) {
    let members = teamMembers.map((member) => {
        return <Col>
        <h4>{member.name}</h4>
        {member.linkedin ? <span>LinkedIn: {member.linkedin}</span> : <br></br>}
        </Col>
    })
        return <Container>
                    <Row>
                        {members}
                    </Row>
                </Container>
}
export default AboutComponent;