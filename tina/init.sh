#!/usr/bin/env bash
#
cd web
npm init -y
npm install create-tina-app

#
# The followig command will ask some questions
# - package manager -> npm
# - project name -> glacieronehealth
# - starter code -> NextJS starter
#
npx create-tina-app 

rm -r node_modules package*

cd glacieronehealth

# nur node:24
npm install-scripts approve --all
npm rebuild

export NODE_OPTIONS="--dns-result-order=ipv4first"
npm run dev

#
# later run 'npm run build-local'
#
