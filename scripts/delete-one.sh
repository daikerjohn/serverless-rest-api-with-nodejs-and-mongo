#!/bin/bash

asdf=$1
echo "use dero_db
db.hashranges.find({_id: ObjectId(\"${asdf}\")})
db.hashranges.deleteOne({_id: ObjectId(\"${asdf}\")})
exit" > inp.js

cat inp.js

mongosh < inp.js

rm inp.js
