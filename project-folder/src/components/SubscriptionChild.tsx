import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { closeCircleOutline, removeCircleOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import FeedList from './FeedList';
import CollectionModal from './CollectionModal'
import './SubscriptionChild.css'
import { article } from './ArticleTypes';

type MyState = {
    isCollectionModalOpen: any;
}
type MyProp ={
     subscription: any;
     index: any;
     func: any;
     articles: any[];
     openShareModal: (theArticle: article, shouldOpen: boolean) => void
}

class ChildComponent extends React.Component<MyProp, MyState> {
    state:MyState ={
        isCollectionModalOpen:false
    }


    constructor(props:MyProp) {
        super(props)
        this.collectionCloseButton = this.collectionCloseButton.bind(this);
    }



    handleCloseModal = () => {
        this.setState({ isCollectionModalOpen: false });
      };


    collectionCloseButton() {
        this.setState({isCollectionModalOpen: false});
    }

    render(){
        return (
            <>
            <IonItem button={true} onClick={() => this.setState({ isCollectionModalOpen: true })}>
                <IonCard id="card" >
                    <IonCardHeader>
                        <IonCardTitle>{this.props.subscription}</IonCardTitle>
                    </IonCardHeader>
                </IonCard>
                </IonItem>
                <CollectionModal showModal={this.state.isCollectionModalOpen}
                  closeModal={this.collectionCloseButton}
                  articles={this.props.articles} index={this.props.index}
                  subscription={this.props.subscription}
                  func={this.props.func}
                  openShareModal={this.props.openShareModal}
                />
              </>
              );
            }
          }

export default ChildComponent;
