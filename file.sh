#!/bin/bash
# get current directory
pwd

# create directory
sudo mkdir webapp

# unzip the file in directory
sudo unzip ./webapp.zip -d ./webapp

# change the permissions
sudo chmod 755 webapp

# change permission of webapp
sudo chown -R ec2-user ./webapp
