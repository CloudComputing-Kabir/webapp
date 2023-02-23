#!/bin/bash

sudo amazon-linux-extras install epel -y 
# Installing mysql
sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm -y
sudo yum -y install mysql-community-server

sudo systemctl enable --now mysqld
systemctl status mysqld

sudo yum install expect -y

temp_password=$(sudo grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}')

SECURE_MYSQL=$(expect -c "
set timeout 10
spawn mysql_secure_installation
expect \"Enter password for user root:\"
send \"$temp_password\r\"
expect \"New password:\"
send \"17227860\r\"
expect \"Re-enter new password:\"
send \"17227860\r\"
expect \"Change the password for root ? ((Press y|Y for Yes, any other key for No) :\"
send \"n\r\"
expect \"Remove anonymous users? (Press y|Y for Yes, any other key for No) :\"
send \"y\r\"
expect \"Disallow root login remotely? (Press y|Y for Yes, any other key for No) :\"
send \"y\r\"
expect \"Remove test database and access to it? (Press y|Y for Yes, any other key for No) :\"
send \"y\r\"
expect \"Reload privilege tables now? (Press y|Y for Yes, any other key for No) :\"
send \"y\r\"
expect eof
")

echo "$SECURE_MYSQL"

mysql -uroot -p17227860 -e "CREATE DATABASE CloudAssignment1"
