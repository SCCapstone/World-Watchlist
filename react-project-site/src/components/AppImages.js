import './AppImages.css'
import {Container,Row,Col} from 'react-bootstrap'
import pageInfo from '../data/pageInfo'
import logo from '../images/icon.png'
import feedTab from '../images/FeedTab.png'
import settingsTab from '../images/Settings.png'
import bookmarkTab from '../images/bookmark.PNG'
import Social from '../images/FriendsAndGroups.png'
import Weather from '../images/WeatherTab.png'
import searchTopicPage from '../images/searchTopic.PNG'
import groupSubscriptions from '../images/groupSubscriptions.PNG'
function AppImages() {
    const img = logo
    return <div className="Images-Section">
            <h2 id="title">Screenshots</h2>
            <Container>
                            <Row>
                                <Col>
                                <img
                                    src={feedTab}
                                    width="250"
                                    height="500"
                                    />  
                                    <p id="paragraph">{pageInfo.feedTab}</p>
                                </Col>
                                <Col><img
                                    src={Social}
                                    width="250"
                                    height="500"
                                    />  <p id="paragraph">{pageInfo.socialTab}</p></Col>
                                    <Col><img
                                    src={bookmarkTab}
                                    width="250"
                                    height="500"
                                    />  <p id="paragraph">{pageInfo.bookmarkTab}</p></Col>
                                <Col><img
                                    src={settingsTab}
                                    width="250"
                                    height="500"
                                    />  <p id="paragraph">{pageInfo.settingsTab}</p></Col>
                                <Col><img id="image"
                                    src={Weather}
                                    width="250"
                                    height="500"
                                    />  <p id="paragraph">{pageInfo.weatherPage}</p></Col>
                                <Col><img id="image"
                                    src={searchTopicPage}
                                    width="250"
                                    height="500"
                                    /> <p id="paragraph">{pageInfo.searchTopicPage}</p></Col>
                                <Col><img id="image"
                                    src={groupSubscriptions}
                                    width="250"
                                    height="500"
                                    /> <p id="paragraph">{pageInfo.GroupPage}</p></Col>
                                
                            </Row>
                         
                    </Container>
         </div>
}
export default AppImages;