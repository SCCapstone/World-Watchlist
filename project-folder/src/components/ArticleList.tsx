import React from 'react';
import Article from './Article';
import { article, articleList } from './ArticleTypes';

function ArticleList(props: {theArticleList: articleList, openShareModal: (theArticle: article, shouldOpen: boolean) => void}) {
    // console.log(props.theArticleList)
    let articles = props.theArticleList.map((x: article) =><div key={x.title}> <Article theArticle={x} openShareModal={props.openShareModal}></Article> </div>);
return <div key={props.toString()}>{articles}</div>;
}
export default ArticleList;
