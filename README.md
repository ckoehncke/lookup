# kranky
Chris's Twilio script

# Installation

- install node.js https://nodejs.org/
- clone or download the repo to your machine
- go to the directory and use $>sudo npm install . -g
- run the app from the command line with $>kranky input.csv output.csv

Where the input.csv file is the file containing the numbers you want to look up and output.csv is the output file. This file will be appended to, so use a different filename if you want to the output to remain clean.


# Limits

There is a limit of 100 records in the code. If you want to update this, its in the index.js file on approximately line 47. You will need to reinstall the kranky executable after any change with $>npm install . -g


Enjoy!