EXPECTED=2
if [ $# -eq $EXPECTED ] 
then
    echo "Creating personal environments"
else 
    echo "Must provide a client port and a host port as command line arguments"
    exit 1
fi

CLIENT=$1
HOST=$2

touch client/.env.local
echo "" >> client/.env.local
echo "PORT=$CLIENT" >> client/.env.local
echo "HOST_PORT=$HOST" >> client/.env.local
echo "REACT_APP_PORT=$CLIENT" >> client/.env.local
echo "REACT_APP_HOST_PORT=$HOST" >> client/.env.local

touch server/.env.local
echo "" >> server/.env.local
echo "CLIENT_PORT=$CLIENT" >> server/.env.local
echo "PORT=$HOST" >> server/.env.local


echo "DONE."