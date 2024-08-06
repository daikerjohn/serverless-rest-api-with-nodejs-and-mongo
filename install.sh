#!/bin/bash

sudo npm install -g --include=dev

sudo cp ./dero-cracker-server.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl status dero-cracker-server.service 

sudo systemctl enable dero-cracker-server.service 

sudo systemctl start dero-cracker-server.service 
