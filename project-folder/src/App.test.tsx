import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import Article from './components/Article';
import { article } from './components/ArticleTypes';
import Errors from './components/Errors';
import WeatherSubChild from './components/WeatherSubChild';
import AddFriends from './components/AddFriends';
import ArticleList from './components/ArticleList';


test('Returns error messages', () => {
  const {baseElement} = render(<Errors errors={["This is a message"]}></Errors>);

  expect(baseElement).toBeDefined();
});

// test('renders weather item', () => {
//   <WeatherSubChild weather_code='anItem' temp='90' ></WeatherSubChild>
// })
test('article list works', () => {
  let theArticle : article = {title: 'Breaking', link: "test.com",
  description: "Some news here", source: "test", pubDate: (new Date(Date.now())).toString()};
  let theArticles = [theArticle]
  const {baseElement} = render(<ArticleList theArticleList={theArticles} openShareModal={(theArticle, False) => null}></ArticleList>);

  expect(baseElement).toBeDefined();
})
test('article list works if empty', () => {
  const {baseElement} = render(<ArticleList theArticleList={[]} openShareModal={(theArticle, False) => null}></ArticleList>);

  expect(baseElement).toBeDefined();
})
// test('article list works', () => {
//   const {baseElement} = render(<ArticleList></ArticleList>);

//   expect(baseElement).toBeDefined();
// })

test('test add friends component', () => {
  const { baseElement } = render(<AddFriends history={undefined} location={undefined} isAddFriendModalOpen={true}
    toggleAddFriendModal={() => {}} addFriend={async (word) => {return word}}></AddFriends>)

  expect(baseElement).toBeDefined();
})

test('renders article', () => {
  let theArticle : article = {title: 'Breaking', link: "test.com",
   description: "Some news here", source: "test", pubDate: (new Date(Date.now())).toString()};
  
  const { baseElement } = render(<Article theArticle={theArticle} openShareModal={(theArticle, False) => null}></Article>);

  expect(baseElement).toBeTruthy();
});

// test('renders without crashing', () => {
//   const { baseElement } = render(<App />);
  
//   expect(baseElement).toBeDefined();
// });
