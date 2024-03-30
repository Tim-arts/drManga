#! /bin/bash

git pull origin master
composer update
yarn install
database_generate.sh
yarn encore production
php console cache:clear
