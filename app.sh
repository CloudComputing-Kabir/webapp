#!/bin/bash
echo "---------------current directory - /home/ubuntu----------------"
# get current directory //home/ubuntu
pwd
# get into webapp
cd ./webapp || exit

echo "---------------installing app dependencies - NPM----------------"
# install all the dependencies
#npm install
npm ci

echo "---------------hosting up the app - PM2 config----------------"
sudo pm2 start npm --name "csye6225-webapp" -- run "start"
# start app using pm2
sudo pm2 startup systemd
# pm2 save the list
sudo pm2 save
# pm2 list all the running apps
sudo pm2 list
