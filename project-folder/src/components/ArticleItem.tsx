import React from 'react';

interface articleType {
    url: string;
    title: string;
    description: string;
}

function ArticleItem(props: {entry: articleType}) {
    return (
        <div>
            <p>{props.entry.url}</p>
            <p>{props.entry.title}</p>
        </div>
    );
}
export default ArticleItem;
