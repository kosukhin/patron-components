#!/bin/bash

echo "BEGIN"
cd docs
cp template.html index.html
sed -i "s/TPL_PATRON_OOP/https:\/\/cdn.jsdelivr.net\/npm\/patron-oop@1.46.0\/dist\/patron.min.mjs/g" "index.html"

sed -i "s/TPL_PATRON_WEB_API/https:\/\/cdn.jsdelivr.net\/npm\/patron-web-api@1.14.0\/dist\/patron-web-api.min.mjs/g" "index.html"

sed -i "s/TPL_PATRON_COMPONENTS/https:\/\/cdn.jsdelivr.net\/npm\/patron-oop-components@1.20.0\/dist\/patron-components.min.mjs/g" "index.html"

sed -i "s/TPL_PATRON_DESIGN/https:\/\/raw.githubusercontent.com\/kosukhin\/patorn-design-system\/refs\/heads\/main\/custom.css/g" "index.html"

cp template.html index-dev.html
sed -i "s/TPL_PATRON_OOP/http:\/\/127.0.0.1:5502\/dist\/patron.min.mjs/g" "index-dev.html"

sed -i "s/TPL_PATRON_WEB_API/http:\/\/127.0.0.1:5501\/dist\/patron-web-api.min.mjs/g" "index-dev.html"

sed -i "s/TPL_PATRON_COMPONENTS/http:\/\/127.0.0.1:5500\/dist\/patron-components.min.mjs/g" "index-dev.html"

sed -i "s/TPL_PATRON_DESIGN/http:\/\/127.0.0.1:5504\/custom.css/g" "index-dev.html"

echo "DONE!"

./buildRoutes.sh
