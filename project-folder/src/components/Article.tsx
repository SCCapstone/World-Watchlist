import React from 'react';
import { article } from './ArticleTypes';
import './Article.css'

function Article(props: {theArticle: article}) {
    //console.log(props.theArticle);
    return <div id="Container">
        <h3 id="title">{props.theArticle.title}</h3>
        <p id="description">{props.theArticle.description}</p>
        <span><a href={props.theArticle.link}>{props.theArticle.link}</a></span>
    </div>;
}
export default Article;