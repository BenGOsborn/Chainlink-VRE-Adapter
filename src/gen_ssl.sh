#!/bin/bash

# First I need to delete the old certificates folder
mkdir -p certificates/private
mkdir -p certificates/certs

# Generate the SSL certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./certificates/private/nginx-selfsigned.key -out ./certificates/certs/nginx-selfsigned.crt