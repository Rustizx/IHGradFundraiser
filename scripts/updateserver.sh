#!/bin/bash
cd ~/

ssh ihgrad@45.114.224.19 "cd ~/; rm -rf temp; mkdir temp; mkdir temp/client"
scp -r "/Users/joshblayone/Projects/IHGradFundraiser/.env.production" ihgrad@45.114.224.19:/home/ihgrad/temp/.env
scp -r "/Users/joshblayone/Projects/IHGradFundraiser/client/.env.production" ihgrad@45.114.224.19:/home/ihgrad/temp/client/.env
ssh ihgrad@45.114.224.19 -t "cd ~/; bash -ic './serversideupdate.sh'"