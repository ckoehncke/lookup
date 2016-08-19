#!/usr/bin/env node
var rest = require('restler');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
// use this to throttle the requests
var sleep = require('sleep');

var inputFileName = process.argv[2];
// specify an optional output filename
var outputFileName = process.argv[3];

// set up the twilio client
var accountSid = 'AC839dff9e31b315840894670488013f6d';
var authToken = '04ecc867db7ca9d91c8ff2845d2166b2';

var twilio = require('twilio');
var client = new twilio.LookupsClient(accountSid, authToken);
//debugger;

if (!inputFileName) {
    console.log('You must specify an input file to parse.\nUsage: $>kranky input.csv output.csv');
    process.exit(1);
}
if (!outputFileName) {
    console.log('You must specify an output file.\n$>kranky input.csv output.csv');
    process.exit(1);
}

console.log('Input File Name', inputFileName);

var header = '"input_number",';
header += '"country_code",';
header += '"phone_number",';
header += '"national_format",';
header += '"carrier_name",';
header += '"carrier_type"\n';

fs.appendFileSync(outputFileName, header);

var instream = fs.createReadStream(inputFileName);

var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

//-----------------------------------------------------------------------------
// RECORD LIMIT - set this if you don't want to run a whole file
//-----------------------------------------------------------------------------
var limit = 100;

rl.on('line', function(line) {
    // process line here
    // pause the stream
    rl.pause();
    if (limit > 0) {
        console.log(line);

        rest.get("https://lookups.twilio.com/v1/PhoneNumbers/+" + line + '?Type=carrier', {
            username: accountSid,
            password: authToken
        }).on('complete', function(result, response) {
            // throttle it
            sleep.usleep(500000);
            rl.resume();

            //console.log(result);
            if (result instanceof Error) {
                console.log('Error', result);

            } else {

                var newline = '"' + line + '",';
                if (result.country_code) {
                    newline += '"' + result.country_code + '",';
                } else {
                    newline += '"",';
                }

                if (result.phone_number) {
                    newline += '"' + result.phone_number + '",';
                } else {
                    newline += '"",';
                }
                if (result.national_format) {
                    newline += '"' + result.national_format + '",';
                } else {
                    newline += '"",';
                }
                if (result.carrier && result.carrier.name) {
                    newline += '"' + result.carrier.name + '",';
                } else {
                    newline += '"",';
                }
                if (result.carrier && result.carrier.type){
                    newline += '"' + result.carrier.type + '"\n';
                }else{
                	newline += '""\n';
                }

                fs.appendFileSync(outputFileName, newline);
                console.log(newline);


            }
        });

        // this is the twilio client code which doesn't work as expected.
        //debugger;
        // var phoneNumbers = client.phoneNumbers(line);
        // phoneNumbers.get(function(error, number) {
        //     //client.phoneNumbers.get(line, function(error, number) {
        //     	debugger;
        //     	console.log('-------\n', number, number.carrier);
        // });
    }
    limit--;


});

rl.on('close', function() {
    // do something on finish here
    console.log('EoF');
});
