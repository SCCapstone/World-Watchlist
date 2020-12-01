import React from 'react';
import { article } from './articleTypes';


function Article(props: {theArticle: article}) {
    //console.log(props.theArticle);
    return <div>
        <h3>{props.theArticle.title}</h3>
        <span><a href={props.theArticle.link}></a></span>
        <p>{props.theArticle.description}</p>
    </div>;
}
export default Article;