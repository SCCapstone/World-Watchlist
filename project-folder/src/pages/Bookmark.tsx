
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonModal, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import React from 'react';
import FeedList from '../components/FeedList';
import firebase, {db,auth} from '../firebase'
import './Bookmark.css'
import BookmarkChildren from '../components/BookmarkChildren';
type MyState = {
    bookmark:any[]
}
  
type MyProps = {
    
}
  
class Bookmark extends React.Component<MyProps, MyState> {
    
    state: MyState = {
        bookmark:[],
    };
    
    constructor(props: MyProps) {
        super(props);
        
    }

    componentDidMount(){
        auth.onAuthStateChanged(async ()=>{
            db.collection("bookmarks").doc(auth.currentUser?.uid).onSnapshot(async (doc) => {
                if (doc.exists)
                    this.setState({bookmark:await doc.data()?.bookmark});
                else {
                    await db.collection("bookmarks").doc(auth.currentUser?.uid).set({bookmark: []});
                }
            })
        })
    }

    render() {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar class='feedToolbar2'>
                        <IonTitle class='feedTitle2'>
                            Bookmarked articles
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                    <IonContent>
                        <BookmarkChildren
                            bookmark={this.state.bookmark}
                        />
                    </IonContent>
            </IonPage>
        )
    
    }
}

export default Bookmark
