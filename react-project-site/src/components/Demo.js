import {ResponsiveEmbed} from 'react-bootstrap'
import './Demo.css'
function Demo() {
    return <div className="demo" style={{ width: 660, margin:'auto' }}>
          <h2 id="title">Demo</h2>
    <ResponsiveEmbed aspectRatio="16by9">
    <iframe src="https://drive.google.com/file/d/1ZY-BqUK7iglykKTF4bZYS6k6t5JEX6-q/preview" width="640" height="480"></iframe>
    </ResponsiveEmbed>
  </div>
}
export default Demo;