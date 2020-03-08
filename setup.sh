#!/bin/bash

echo 'STARTING GANACHE '
npm run ganache > ganache.log &
sleep 5s
echo 'OK'

echo 'COMPILE'
npm run compile
echo 'OK'

echo 'MIGRATE'
npm run migrate:dev
echo 'OK'
