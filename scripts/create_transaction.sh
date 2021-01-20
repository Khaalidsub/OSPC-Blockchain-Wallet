#!/bin/bash -xe

# create transaction
transaction=$(curl -X POST -H "Content-Type: application/json" -d  '{"transaction":{"sender":"khaalid","recipient":"ibrahim", "data":{"charge":"15.0"}}}' http://localhost:80/wallet1/transaction/add)
# add transaction
echo $transaction
# create blockchain