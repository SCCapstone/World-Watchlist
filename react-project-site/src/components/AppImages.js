import './AppImages.css'
import {Container,Row,Col} from 'react-bootstrap'
import pageInfo from '../data/pageInfo'
import logo from '../images/icon.png'
function AppImages() {
    const img = logo
    return <div className="Images-Section">
            <Container>
                            <Row>
                                <Col>
                                <img
                                    src={"https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2019/08/instagram-login.png"}
                                    width="450"
                                    height="450"
                                    />  
                                    <p id="paragraph">{pageInfo.feedTab}</p>
                                </Col>
                                <Col><img
                                    src={"https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2019/08/instagram-login.png"}
                                    width="450"
                                    height="450"
                                    />  <p id="paragraph">{pageInfo.socialTab}</p></Col>
                                <Col><img
                                    src={"https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2019/08/instagram-login.png"}
                                    width="450"
                                    height="450"
                                    />  <p id="paragraph">{pageInfo.settingsTab}</p></Col>
                                <Col><img
                                    src={"https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2019/08/instagram-login.png"}
                                    width="450"
                                    height="450"
                                    />  <p id="paragraph">{pageInfo.weatherPage}</p></Col>
                            </Row>
                            <Row>
                                <Col><img
                                    src={"https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2019/08/instagram-login.png"}
                                    width="450"
                                    height="450"
                                    />  <p id="paragraph">{pageInfo.searchTopicPage}</p></Col>
                                <Col><img
                                    src={"https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2019/08/instagram-login.png"}
                                    width="450"
                                    height="450"
                                    />  <p id="paragraph">{pageInfo.GroupPage}</p></Col>
                                <Col><img
                                    src={"https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2019/08/instagram-login.png"}
                                    width="450"
                                    height="450"
                                    />  <p id="paragraph">{pageInfo.bookmarkTab}</p></Col>
                            </Row>
                         
                    </Container>
         </div>
}
export default AppImages;