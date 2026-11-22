#!/usr/bin/env bash
#
mkdir web
cd web
hugo new site . --force --format yaml
# Congratulations! Your new Hugo site is created in /app/web.
#
# Just a few more steps and you're ready to go:
#
# 1. Download a theme into the same-named folder.
#    Choose a theme from https://themes.gohugo.io/ or
#    create your own with the "hugo new theme <THEMENAME>" command.
# 2. Perhaps you want to add some content. You can add single files
#    with "hugo new <SECTIONNAME>/<FILENAME>.<FORMAT>".
# 3. Start the built-in live server via "hugo server".
#
# Visit https://gohugo.io/ for quickstart guide and full documentation.


#
# Add sveltia
#
mkdir -p static/admin
wget -O static/admin/sveltia-cms.js https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js

cat <<EOF >static/admin/index.html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manager</title>
  </head>
  <body>
    <script src="/admin/sveltia-cms.js" type="module"></script>
  </body>
</html>
EOF

#
# Add Hugo YAML-Config
#
mkdir -p content/news content/about static/uploads

cat <<EOF >static/admin/config.yml
local_backend: true

backend:
  name: github
  repo: glacieronehealth/testweb
  branch: main

media_folder: static/uploads
public_folder: /uploads

collections:
  - name: news
    label: News
    folder: content/news
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Date, name: date, widget: datetime }
      - { label: Image, name: image, widget: image, required: false }
      - { label: Content, name: body, widget: markdown }

  - name: about
    label: About
    folder: content/about
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Order, name: weight, widget: number, default: 10 }
      - { label: Keywords, name: tags, widget: list, required: false }
      - { label: Content, name: body, widget: markdown }
EOF

#
# - web/config.yaml anpassen ...
# - decap-server starten
#
socat TCP-LISTEN:8080,bind=0.0.0.0,fork,reuseaddr TCP:127.0.0.1:8081 &
hugo server --bind 0.0.0.0 --port 1313 &
npx --yes decap-server

