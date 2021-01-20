#!/bin/bash -xe

# make consensus
blockchain=$(curl -X GET -H "Content-Type: application/json" http://localhost:80/$1/blockchain/consensus)
