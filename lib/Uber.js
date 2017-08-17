'use strict';

const _ = require('lodash');
const Axios = require('axios');
const QueryString = require('querystring');

class Client {

    constructor(access_token, isSandbox) {
        this.access_token = access_token;

        if(isSandbox){
            this._httpClient = Axios.create({
                baseURL: 'https://sandbox-api.uber.com/v1.2/'
            });
        } else {
            this._httpClient = Axios.create({
                baseURL: 'https://api.uber.com/v1.2/'
            });
        }

        this._httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + this.access_token;

        this.fare_id = "";
        this.product_id = "";
        this.start_lat = "";
        this.start_lng = "";
        this.end_lat = "";
        this.end_lng = "";
        this.seats = "";
    }


    // Request an Uber ride
    getUberXEstimate(){
        const url = 'products?' + QueryString.stringify({
            latitude: this.start_lat,
            longitude: this.start_lng
        });

        return this._httpClient({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            url: url
        }).then(response => {
            let uberX = _.find(response.data.products, ['display_name', 'uberX']);

            if(uberX === undefined)
                return null;

            this.product_id = uberX.product_id;

            const url = 'requests/estimate';
            const params = JSON.stringify({
                product_id: String(this.product_id),
                start_latitude: String(this.start_lat),
                start_longitude: String(this.start_lng),
                end_latitude: String(this.end_lat),
                end_longitude: String(this.end_lng),
                seat_count: String(this.seats)
            });
            //console.log(params);
            return this._httpClient({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: url,
                data: params
            }).then(response => {
                this.fare_id = response.data.fare.fare_id;
                return response.data;
            });
        });
    }
    
    getRequest(){
        const url = 'requests';
        const params = JSON.stringify({
            fare_id: String(this.fare_id),
            product_id: String(this.product_id),
            start_latitude: String(this.start_lat),
            start_longitude: String(this.start_lng),
            end_latitude: String(this.end_lat),
            end_longitude: String(this.end_lng),
            seat_count: String(this.seats)
        });
        //console.log(params);
        return this._httpClient({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            url: url,
            data: params
        }).then(response => {
            return response.data;
        });
    }

    // Get the request current status
    getCurrent(){
        const url = 'requests/current';
        return this._httpClient({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            url: url
        }).then(response => {
            return response.data;
        });
    }

    cancelCurrent(){
        const url = 'requests/current';
        return this._httpClient({
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            url: url
        }).then(response => {
            return response.status;
        });
    }


    // Get the user profile
    getProfile(){
        const url = 'me';
        return this._httpClient({
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            url: url
        }).then(response => {
            let profile = _.get(response, 'data');
            return profile;
        });
    }

    /*authorize(){
        const url = 'authorize?' + QueryString.stringify({
            response_type: 'code',
            client_id: this.client_id,
            scope: 'request profile history',
            redirect_uri: this.redirect_uri
        });

        return this._httpClient({
            method: 'GET',
            url: url
        }).then(response => {
            console.log(response);
            // Get the code from the response
           /!* const code_key = 'code';
            const result = _.pick(response.data, code_key)
            this.code = _.get(result, code_key, this.code);*!/
        });
    }

    getAccessToken() {
        const url = 'token';
        const params = QueryString.stringify({
            client_id: this.client_id,
            client_secret: this.client_secret,
            grant_type: 'authorization_code',
            redirect_uri: this.redirect_uri,
            code: this.code
        });
        return this._httpClient({
            method: 'POST',
            url: url,
            data: params
        }).then(response => {
            const access_token_key = 'access_token';
            const result = _.pick(response.data, access_token_key)
            this.access_token = _.get(result, access_token_key, this.access_token);

            this._httpClient.baseURL = 'https://api.uber.com/v1.2/';

            return result;
        });
    }*/
}

module.exports = Client;