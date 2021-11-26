#!/bin/bash

curl "https://www.python.org/ftp/python/3.9.4/Python-3.9.4.tgz" -o python.tgz
tar xzf python.tgz
rm python.tgz
cd python

./configure --with-ensurepip=install
make -j$(nproc)
make install -j$(nproc)

cd ..

rm -rf python 