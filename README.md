# Uber Ride Request

Request an __UberX__ ride by only setting the _starting_ and _ending_ GPS coordinates.

## Installing

Using npm:

```bash
$ npm install --save uber-ride-request
```

## Usage

Create a new application on the __[Uber developer web platform](https://developer.uber.com/dashboard/)__.

Under the "__AUTHORIZATION__" tab:

* Initially, you need to get a __Bearer access token__ (used to authenticate the requests we make to the Uber API). The easiest way I found was to generate it on the [Uber developer web platform](https://developer.uber.com/dashboard/). This token will be valid for _30 days_, but a refresh token can be used to extend its validity. You can also generate it with the oAuth2 authentication provided.
* Make sure to enable (at least) the `request` scope .

Have a look at the __[API docs](https://developer.uber.com/docs/riders/introduction)__ for more detailed information on how to authenticate, make API calls, etc...

### Example

Every method on the client returns a promise, so they can be chained together. You can order a ride as following:

```js
const Client = require('uber-ride-request').Uber;

const access_token = "YOUR_ACCESS_TOKEN"; // Retrieve it by generating a token under the "authorization" tab in https://developer.uber.com/dashboard/
const isSandbox = true; // Set to 'false' if you wish to order a real UberX

const uber = new Client(access_token, isSandbox);

uber.start_lat = 48.870694;
uber.start_lng = 2.317030;
uber.end_lat = 48.871405;
uber.end_lng = 2.301235;
uber.seats = 2;

uber.getUberXEstimate().then(result => {
    if(result != null){
        let distance_estimate = (result.trip.distance_estimate * 1.60934).toFixed(2);
        console.log("Estimated distance: " + distance_estimate + " km");
        uber.getRequest().then(result => {
            console.log("Ordered Uber successfully!");
            // Notify user about the ride process after one minute
            setTimeout(function(){
                getCurrentRide();
            }, 60000);
        });
    } else {
        console.warn("No UberX arround you.");
    }
});

function getCurrentRide(){
    uber.getCurrent().then(result =>{
        let status = result.status;
        let eta = result.pickup.eta;
        console.log("Current status: " + status + ". Driver arrives in: " + eta + " minutes.");
    });
}

```


You can also `cancel` an Uber ride requested by using:

```js
uber.cancelCurrent().then(result => {
    if(result == 204){
        console.log("Canceled order successfully!");
    } else {
        res.send("No ride to cancel.");
    }
});
```

## License

MIT


> Antoine de Chassey
