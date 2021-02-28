import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonSearchbar, IonAlert, IonLoading } from "@ionic/react";
import { closeCircleOutline, addCircle } from "ionicons/icons";
import React from "react";
import ArticleList from "./ArticleList";

function SearchModal(props: {showModal: boolean, closeModal: any, topicSearched: string, handleTopicChange: any, searchTopicButton: any, showSearchAlert: boolean, dismissSearchAlertButton: any, showLoading: boolean}) {
//     <IonModal isOpen={props.showModal} onDidDismiss={props.closeModal}>
//     <IonHeader>
//         <IonToolbar class='feedToolbar2'>
//     <IonButtons slot='start'>
//             <IonButton onClick={props.closeModal} fill='clear'>
//               <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
//             </IonButton>
//     </IonButtons>

//     <IonTitle class='feedTitle2'>
//       Search Topics
//     </IonTitle>
//     </IonToolbar>
//     </IonHeader>
//     <IonContent>
//     <IonSearchbar placeholder="Enter a Topic or Location" value={props.topicSearched} onIonInput={props.handleTopicChange} animated>
//   </IonSearchbar>

//   <IonButton id="searchButton" expand="block" fill="outline" type="submit" shape="round" onClick={async () => await props.searchTopicButton}>
//       Search
//   </IonButton>

//   <IonAlert
//       isOpen={props.showSearchAlert}
//       onDidDismiss={props.dismissSearchAlertButton}
//       message="Enter a valid topic or location"
//    />
//   <IonLoading
//     isOpen={props.showLoading}
//     message={'Loading...'}
//     duration={7000}
//   />


//   {/* <IonItem> */}
//      {/* check if person wants to search location */}
// {/* <IonLabel>Location based search</IonLabel> */}
// {/* <IonCheckbox onIonChange={e=> this.setState({locationBased:e.detail.checked}) }></IonCheckbox> */}
// {/* </IonItem> */}
//   <IonModal isOpen={this.state.isSearchingModal} >
//   <IonHeader>
//   <IonToolbar id="newsToolbar">
//   <IonButtons slot='start'>
//             <IonButton onClick={() => this.setState({isSearchingModal: false})} fill='clear'>
//               <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
//             </IonButton>
//     </IonButtons>
//     <IonButtons slot='end'>
//     <IonButton onClick={()=> this.subscribe(props.topicSearched) && this.setState({showSubscribeAlert:true})} fill='clear'>
//     <IonIcon id="addTopic" icon={addCircle}/>
//     </IonButton>
//   </IonButtons>
//   <IonTitle id="newsTitle">
//       News
//     </IonTitle>
//   </IonToolbar>
//   </IonHeader>
//   <IonContent>

//   <ArticleList theArticleList={this.state.articlesSearched}></ArticleList>
//   <IonAlert
//       isOpen={this.state.showSubscribeAlert}
//       onDidDismiss={() => this.setState({showSubscribeAlert:false,isSearchingModal:false})}
//       message={"Subscribed to " + props.topicSearched}
//    />
//   </IonContent>
//   </IonModal>
//     </IonContent>
// </IonModal>
}
export default SearchModal;