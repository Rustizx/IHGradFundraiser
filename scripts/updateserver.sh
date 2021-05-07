#!/bin/bash
cd ~/

ssh ihgrad@208.79.219.103 "cd ~/; rm -rf temp; mkdir temp; mkdir temp/client"
scp -r "/Users/joshblayone/Projects/IHGradFundraiser/.env.production" ihgrad@208.79.219.103:/home/ihgrad/temp/.env
scp -r "/Users/joshblayone/Projects/IHGradFundraiser/client/.env.production" ihgrad@208.79.219.103:/home/ihgrad/temp/client/.env
ssh ihgrad@208.79.219.103 -t "cd ~/; bash -ic './serversideupdate.sh'"