## To run locally

```
AWS_PROFILE=auber-default sls offline --stage local
```

## To deploy on dev/prod

```
cd src/functions/{ms}
sls deploy --stage dev/prod
```

where ms is one of the folders inside functions folder representing a microservice.
