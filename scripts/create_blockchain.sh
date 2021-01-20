#!/bin/bash -xe

# create blockchain
blockchain=$(curl -X GET -H "Content-Type: application/json" http://localhost:80/wallet1/blockchain/mine)
# add blockchain
echo $blockchain
# create blockchain