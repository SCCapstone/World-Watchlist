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

unit tests using Jest for server-side are in '/server/functions' 

unit/behavioral tests located in tests
tests requirements:
- python
- selenium
- compatible web browser: Chrome, Firefox, Safari, Edge, etc.
- web driver for web browser

What I did:
	Installed python if not already installed
	Installed selenium via pip
	Had chrome browser installed already, installed firefox browser
	Installed webdrivers, locations below:
		Chrome - https://sites.google.com/a/chromium.org/chromedriver/downloads
		Firefox - https://github.com/mozilla/geckodriver/releases/tag/v0.29.0
	optional: Moved drivers to program directory to avoid typing long path
To run the program:
	[python (with selenium) or ./my_test.sh (if python3 has selenium installed) ] path/to/driver url email password
	Ex. python3 foo/bar/driver.exe http://localhost:1001 user@email.com password1234
	\* There is a test account: email=test@email.com, password=TestPassword, username=test#0
Tutorials used:
https://www.browserstack.com/guide/python-selenium-to-run-web-automation-test
https://linuxhint.com/using\_selenium\_firefox\_driver/


##### Running Tests
``` 
cd server/functions
npm i
npm run test
```

#### Authors

Nguyen Nguyen - nguyentwotimes@gmail.com

Zhymir Thompson - dzhymir@gmail.com

Justin Taylor - justinelijahtaylor@gmail.com

Clay Mallory - claymallory34@googlemail.com

Kristina Matthews - kristinamatthews002@gmail.com

