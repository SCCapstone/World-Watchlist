# World-Watchlist

Our goal is to create a social news watchlist app that will allow users socialize and denote keywords or topics and to receive live notifications when an article is published matching their keyword or topic. Check out our [wiki](https://github.com/SCCapstone/World-Watchlist/wiki/Project-Description) for a more in-depth description. 

#### External Requirements/ Technologies

- [Ionic](https://ionicframework.com/)
- [React](https://ionicframework.com/docs/react)
- [Firebase](https://firebase.google.com/)
- [Node.js](https://nodejs.org/en/)

#### Setting up ionic-react and scrape server to test locally
- Testing locally requires linux command line.
- Clone repo, change to project-folder directory, and install modules.

``` 
git clone https://github.com/SCCapstone/World-Watchlist.git
cd World-Watchlist
cd project-folder
npm i
ionic serve
```
#### Deploying on Android
```
ionic build (creates build of app)
ionic capacitor add android (adds android files, not need if you already have android file)
npx cap sync android (sync build to android)
ionic capacitor copy android (does both of the command above in one command)
npx jetifier (make it buildable in android studio)
ionic cap open android (opens android studio)
```
In the Android menu, go to Build > Build Bundle(s) / APK (s) > Build APK(s).

#### Node Server

``` 
cd server
npm i
firebase serve
```


### Testing

unit tests using Jest for server-side are in '/server/functions/tests' 

unit/behavioral tests located in '/tests'

Testing Technology:
- python
- selenium
- compatible web browser: Chrome, Firefox, Safari, Edge, etc.
- web driver for web browser

Install python if not already installed
	
Install selenium via pip - i.e. python3 -m pip install selenium
	
Install webdrivers if you are not on windows (Drivers currently in the 'test/driver' folder are specifically for windows), locations below:
	
- [Chrome Driver](https://sites.google.com/a/chromium.org/chromedriver/downloads)
		
- [Firefox Driver](https://github.com/mozilla/geckodriver/releases/tag/v0.29.0)
		
Optional: Moved drivers you downloaded to '/tests/drivers' to avoid typing long pathname.

##### Running Unit Tests in '/server/functions/tests' 
``` 
cd server/functions
npm i
npm run test
```

##### Running behaviorial Tests in 'tests'

First go to 'project-folder' and run the localhost.

```
ionic serve
```

open up new terminal to go into 'tests'

```
./behavioral_tests.sh
```

##### Running behavioral tests through SeleniumIDE
``` 
cd project-folder
ionic serve
```
* Open SeleniumIDE and press CMD+O
* Select WorldWatchlistSettingsTests.side from \World-Watchlist\tests
* In SeleniumIDE, select one of the available tests and hit the play button.

Information about a running test can be found in the 'Log' section.
#### Authors

Nguyen Nguyen - nguyentwotimes@gmail.com

Zhymir Thompson - dzhymir@gmail.com

Justin Taylor - justinelijahtaylor@gmail.com

Clay Mallory - claymallory34@googlemail.com

Kristina Matthews - kristinamatthews002@gmail.com

