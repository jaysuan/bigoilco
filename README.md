# Big Oil, Co.

## Requirements
* Node.js 12
* npm
* Firebase CLI ([Installation Instructions](https://firebase.google.com/docs/cli))
* MySQL

---

## Installation
1. Under project root directory, run `npm install`
2. Run `npm run build`
3. Go to `functions` directory and run `npm install`

---


## Running in dev mode

Under project root directory, run `npm run serve`

---


## Running Firebase emulator
Run `firebase emulators:start --only functions,hosting`

---

## Setting up environment variables
### Environment variables for Vue app

Under project root directory, create file `.env`

Enter the following:
```
VUE_APP_API_URL=EMULATOR_FUNCTION_URL/api
```

### Environment variables for Cloud Functions
Go to `functions` directory and create `.runtimeconfig.json` file

Enter the following:
```json
{
    "db": {
        "env": "local",
        "user":"LOCAL_DB_USER",
        "password":"LOCAL_DB_PASSWORD",
        "database": "LOCAL_DB_NAME",
        "host": "LOCAL_DB_HOST",
        "port": "LOCAL_DB_PORT"
    },
    "slack": {
        "enable": false,    // set only to true when testing Slack notifications
        "webhook": {
            "dispatcher": "<DISPATCHER_URL>"
        }
    },
    "server": {
        "baseurl": "<FRONTEND_URL>"
    }
}
```

## Setting up json-server(Fake Server)

1. Under project root directory , run `npm install -g json-server`
2. Go to `src/api-server/` directory, open a new terminal, and run `npx json-server json-server.json --routes routes.json --port 3099`

---


