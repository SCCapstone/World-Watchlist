
function AboutComponent(teamMembers) {
    let members = teamMembers.map((member) => {
        <div>
        <h4>{member}</h4>
        {member.linkedin} ? <span>LinkedIn: {member.linkedin}</span> : <br></br>
        </div>
    })
        return <div>{members}</div>;
}
export default AboutComponent;