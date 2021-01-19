#!/bin/bash -xe
register1=$(curl -X POST -H "Content-Type: application/json" -d  '{"newNodeUrl":"http://wallet-nginx/wallet3"}' http://localhost:80/wallet1/node/register-and-broadcast-node)
register2=$(curl -X POST -H "Content-Type: application/json" -d  '{"newNodeUrl":"http://wallet-nginx/wallet2"}' http://localhost:80/wallet1/node/register-and-broadcast-node)
register3=$(curl -X POST -H "Content-Type: application/json" -d  '{"newNodeUrl":"http://wallet-nginx/wallet1"}' http://localhost:80/wallet2/node/register-and-broadcast-node)

echo $register1
echo $register2
echo $register3