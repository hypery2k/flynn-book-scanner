#!/bin/sh
# 

BASEDIR=$(dirname $0)
buildNo=$1
versionNumber=`grep "id=\"de.holisticon.flynn\" version" ${BASEDIR}/../app/config.xml | cut -f3 -d"=" | cut -f2 -d"\""`
sed -e "s/version=\".*\"/version=\"${versionNumber}\" android-versionCode=\"${buildNo}\" ios-CFBundleVersion=\"${buildNo}\"/g" ${BASEDIR}/../app/config.xml > ${BASEDIR}/../app/config.xml.new
mv ${BASEDIR}/../app/config.xml.new ${BASEDIR}/../app/config.xml

git log `git describe --tags --abbrev=0`..HEAD --oneline >  ${BASEDIR}/../app/src-gen/RELEASE_NOTES
releaseNotes="$(perl -p -e 's/\n/<br>/'  ${BASEDIR}/../app/src-gen/RELEASE_NOTES)"

# updat config.json
versionedConfig="$(jq  .info.version.value=.info.version.value+\""build${buildNo}"\" ${BASEDIR}/../app/src/config.json)"
echo $versionedConfig | jq  .info.release_notes.value=\""${releaseNotes}"\" > ${BASEDIR}/../app/src-gen/config.json