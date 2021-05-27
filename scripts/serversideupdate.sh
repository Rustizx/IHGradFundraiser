#!/bin/sh
. ~/.bash_profile

rm -rf IHGradFundraiser
git clone https://Rustizx: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@github.com/Rustizx/IHGradFundraiser.git
cp temp/.env IHGradFundraiser/.env
cp temp/client/.env IHGradFundraiser/client/.env
cd ~/IHGradFundraiser
npm run in
npm audit fix
npm run build
pm2 restart index --update-env