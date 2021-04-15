
function AboutComponent({teamMembers}) {
    let members = teamMembers.map((member) => {
        return <div>
        <h4>{member.name}</h4>
        {member.linkedin ? <span>LinkedIn: {member.linkedin}</span> : <br></br>}
        </div>
    })
        return <div>{members}</div>;
}
export default AboutComponent;