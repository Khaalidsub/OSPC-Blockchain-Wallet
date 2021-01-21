#!/bin/bash -xe

## create create_transaction
./create_transaction.sh
## create create_blockchain
./create_blockchain.sh
## create create_transaction
./create_transaction.sh
## create create_blockchain
./create_blockchain.sh
## read input : y|Y to continue
echo "Click y|Y to continue... 2"
read first_yes
## register nodes
./init.sh
echo "Click y|Y to continue... 2"
read second_yes
## consensus wallet 2
./make_consensus.sh wallet2
## read input : y|Y to continue
echo "Click y|Y to continue... 3"
read third_yes
## consensus wallet 3
./make_consensus.sh wallet3