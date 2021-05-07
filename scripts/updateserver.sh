#!/bin/bash
cd ~/

ssh ihgrad@208.79.219.103 "cd ~/; rm -rf temp; mkdir temp;"
scp -r "~/Projects/IHGradFundraiser/.env.production" ihgrad@208.79.219.103:/home/ihgrad/IHGradFundraiser/.env
scp -r "~/Projects/IHGradFundraiser/client/.env.production" ihgrad@208.79.219.103:/home/ihgrad/IHGradFundraiser/client/.env