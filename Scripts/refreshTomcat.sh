#!/bin/sh

if [ "$1" = "dev" ]; then
  echo "refresh dev"
  rm -rf /opt/tomcat/webapps/DevWS.war
  rm -rf /opt/tomcat/webapps/DevWS/
  mv /root/InspectorWS-1.0-SNAPSHOT.war /opt/tomcat/webapps/DevWS.war
elif [ "$1" = "test" ]; then
  echo "refresh test"
  rm -rf /opt/tomcat/webapps/TestWS.war
  rm -rf /opt/tomcat/webapps/TestWS/
  mv /root/InspectorWS-1.0-SNAPSHOT.war /opt/tomcat/webapps/TestWS.war
elif [ "$1" = "prod" ]; then
  echo "refresh prod"
  rm -rf /opt/tomcat/webapps/InspectorWS.war
  rm -rf /opt/tomcat/webapps/InspectorWS/
  mv /root/InspectorWS-1.0-SNAPSHOT.war /opt/tomcat/webapps/InspectorWS.war
else
  echo "option: dev | test | prod"
fi
