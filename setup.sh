#!/bin/bash
echo "---------------update software----------------"
sudo yum update -y
sudo yum upgrade -y

# Install dependencies packages
sudo yum install gcc-c++ make -y

echo "---------------installing nodejs----------------"
# Install Node.js repository 16.x
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -

# update the system
sudo yum update -y

# Install Node.js
sudo yum install nodejs -y
# install NPM manager
sudo yum install npm -y

echo "---------------installing zip and unzip----------------"
# install zip and unzip
sudo yum install zip unzip

echo "---------------node versions----------------"
# check node version
node -v

echo "---------------installing PM2----------------"
# install pm2
sudo npm install pm2 -g

echo "---------------setting up permissions----------------"
sudo chmod 755 /etc/environment
sudo chmod 755 /home/ec2-user