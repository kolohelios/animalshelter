#!/bin/bash

# we can use this script to load data into mongodb for the dev or prod environments as well, though it's primarily used by the test suite

if [ -z "$1" ] ; then
  echo "Enter a database name"
  exit 1
fi

mongoimport --jsonArray --drop --db $1 --collection pets --file db_data/pets.json
