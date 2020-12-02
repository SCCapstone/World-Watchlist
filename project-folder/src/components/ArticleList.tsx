import React from 'react';
import Article from './Article';
import { article, articleList } from './ArticleTypes';

function ArticleList(props: {theArticleList: articleList}) {
    //console.log(props.theArticleList);
    let articles = props.theArticleList.map((x: article) =><div key={x.title}> <Article theArticle={x}></Article> </div>);
return <div>{articles}</div>;
}
export default ArticleList;