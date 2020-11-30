import React from 'react';
import Article from './Article';
import { article, articleList } from './articleTypes';

function ArticleList(props: {theArticleList: articleList}) {
    console.log(props.theArticleList);
    let articles = props.theArticleList.map((x: article) => <Article theArticle={x}></Article>);
return <div>{articles}</div>;
}
export default ArticleList;