# World-Watchlist

Our goal is to create a news-watchlist app that will allow users to denote keywords or topics and to receive live notifications when an article is published matching their keyword or topic. Check out our [wiki](https://github.com/SCCapstone/World-Watchlist/wiki/Project-Description) for a more in-depth description. 

#### External Requirements/ Technologies

- [Ionic](https://ionicframework.com/)
- [React](https://ionicframework.com/docs/react)
- [Firebase](https://firebase.google.com/)
- [Node.js](https://nodejs.org/en/)

#### Setting up ionic-react and scrape server to test locally
clone repo, change to project-folder directory, and install modules.

``` 
git clone https://github.com/SCCapstone/World-Watchlist.git
cd World-Watchlist/project-folder
npm i
ionic serve
```
#### Deploying on Android
```
ionic build
ionic cap add android
ionic cap copy
ionic cap sync
ionic cap open android
```
In the Android menu, go to Build > Build Bundle(s) / APK (s) > Build APK(s).

#### Node Server

``` 
cd World-Watchlist/server
npm i
firebase serve
```

#### Authors

Nguyen Nguyen - nguyentwotimes@gmail.com

Zhymir Thompson - dzhymir@gmail.com

Justin Taylor - justinelijahtaylor@gmail.com

Clay Mallory - claymallory34@googlemail.com

Kristina Matthews - kristinamatthews002@gmail.com

