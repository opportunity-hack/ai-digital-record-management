cdk bootstrap -c stage="dev" -c region="us-west-2" -c account="746731052158" --profile=noel2
cdk deploy --all -c stage="dev" -c region="us-west-2" -c account="746731052158" --profile=noel2 -O ../devblocks-web/exports/cdk-exports-dev.json
cdk destroy -c stage="dev" -c region="us-west-2" -c account="746731052158" --profile=noel2 -O ../devblocks-web/exports/cdk-exports-dev.json