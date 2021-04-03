
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonModal, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { book, closeCircleOutline } from 'ionicons/icons';
import React from 'react';
import FeedList from '../components/FeedList';
import firebase, {db,auth} from '../firebase'
import './Bookmark.css'
import { Plugins } from '@capacitor/core';
import BookmarkChildren from '../components/BookmarkChildren';
const { Storage } = Plugins;
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
        auth.onAuthStateChanged(async () => {
            if(auth.currentUser) {
                    db.collection("bookmarks").doc(auth.currentUser?.uid).onSnapshot(async (doc) => {
                        if (doc.exists) {
                            let bookmark = await doc.data()?.bookmark
                            await Storage.set({key:'bookmark',value:JSON.stringify(bookmark)})
                            const bookmarkStorage = await Storage.get({key:"bookmark"})
                            let bookmarkArr = await JSON.parse(bookmarkStorage.value||"")
                            this.setState({bookmark:bookmarkArr});
                        }
                        else {
                            await db.collection("bookmarks").doc(auth.currentUser?.uid).set({bookmark: []});
                        }
                    })
            }
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
