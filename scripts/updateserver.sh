#!/bin/bash
cd ~/

frontend() {
    cd ~/Projects/IHGradFundraiser/client
    npm install
    npm run build
    ssh ihgrad@208.79.219.103 rm -rf /home/ihgrad/IHGradFundraiser/client/build/*
    scp -r build/* ihgrad@208.79.219.103:/home/ihgrad/IHGradFundraiser/client/build/
}

backend() {
    cd ~/Projects/CalFunder/src/landingpage
    npm run build
    ssh root@38.109.217.102 rm -rf /var/www/calfunder.com/*
    scp -r build/* root@38.109.217.102:/var/www/calfunder.com/
}

PS3='What Sites Would You Like To Upload? '
menu=("App" "Docs" "Main" "App+Docs" "App+Main" "Docs+Main" "All" "Quit")
select option in "${menu[@]}"
do
    case $option in
        "App")
            echo "App Selected"
            appupload
            break
            ;;
        "Docs")
            echo "Docs selected"
            docsupload
            break
            ;;
        "Main")
            echo "Main selected"
            mainupload
            break
            ;;
        "App+Docs")
            echo "App+Docs selected"
            appupload
            docsupload
            break
            ;;
        "App+Main")
            echo "App+Main selected"
            appupload
            mainupload
            break
            ;;
        "Docs+Main")
            echo "Docs+Main selected"
            docsupload
            mainupload
            break
            ;;
        "All")
            echo "All selected"
            appupload
            docsupload
            mainupload
            break
            ;;
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done