#!/bin/bash

mongo <<EOF
use $DATABASE
db.createUser({
  user:  '$USERNAME',
  pwd: '$PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$DATABASE'
  }]
})
EOF
