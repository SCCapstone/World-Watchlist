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
cd project-folder
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
cd server
npm i
firebase serve
```


#### Testing

unit tests using Jest for server-side are in '/server/functions/tests' 

unit/behavioral tests located in '/tests'

Testing Technology:
- python
- selenium
- compatible web browser: Chrome, Firefox, Safari, Edge, etc.
- web driver for web browser

Install python if not already installed
	
Install selenium via pip
	
Install webdrivers if you are not on windows (Drivers currently in the 'test/driver' folder are specifically for windows), locations below:
	
- [Chrome Driver](https://sites.google.com/a/chromium.org/chromedriver/downloads)
		
- [Firefox Driver](https://github.com/mozilla/geckodriver/releases/tag/v0.29.0)
		
Optional: Moved drivers you downloaded to '/tests/drivers' to avoid typing long pathname.

##### Running Tests in 'tests'

First go to 'project-folder' and run the localhost.

```
ionic serve
```

open up new terminal to go into 'tests'

```
./unit_tests.sh
```
	
Tutorials used:

- https://www.browserstack.com/guide/python-selenium-to-run-web-automation-test

- https://linuxhint.com/using\_selenium\_firefox\_driver/


##### Running Tests in '/server/functions/tests' 
``` 
cd server/functions
npm i
npm run test
```
##### Running behavoiral tests through SeleniumIDE
ionic serve
Open SeleniumIDE and press CMD+O
Select WorldWatchlistSettingsTests.side from \World-Watchlist\tests
In SeleniumIDE, select one of the available tests and hit the play button.
Information about a running test can be found in the 'Log' section.
#### Authors

Nguyen Nguyen - nguyentwotimes@gmail.com

Zhymir Thompson - dzhymir@gmail.com

Justin Taylor - justinelijahtaylor@gmail.com

Clay Mallory - claymallory34@googlemail.com

Kristina Matthews - kristinamatthews002@gmail.com

