import {ResponsiveEmbed} from 'react-bootstrap'
import './Demo.css'
function Demo() {
    return <div className="demo" style={{ width: 660, margin:'auto' }}>
        <h3>
            Demo
        </h3>
    <ResponsiveEmbed aspectRatio="16by9">
    <iframe  width="1904" height="800" src="https://www.youtube.com/embed/TYkRaj9VwZU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </ResponsiveEmbed>
  </div>
}
export default Demo;