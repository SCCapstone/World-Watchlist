var NodeGeocoder = require('node-geocoder');

var geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: 'ade3451aaaa348da989c053dd53eef56'
});

function test(location) {
    geocoder.geocode(location, function(err, res) {
        
        openCageData = res;
        // let min = Math.min();
        // let bestCityResult;
        // openCageData.results.forEach((r) => {
        //     if (r.confidence < min) {
        //       bestCityResult = r;
        //       min = r.confidence;
        // }
        // console.log(bestCityResult);
        console.log(openCageData[0])
      });
      
    
}

test('sumter, sc')