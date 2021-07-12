const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = new express();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
};



app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
            },
        'keywords': {
            'emotion': false,
            'sentiment': false,
            'limit': 2,
            },
        },
    };
    let sendVal = getNLUInstance().analyze(analyzeParams)
    .then(response => {
        //let results= (JSON.stringify(response, null, 2));
        return res.send(JSON.stringify(response, null, 4));
  })
    .catch(err => {
        return res.send('error');
  });
});

app.get("/url/sentiment", (req,res) => {
    let analyzeSent = {
        'url': req.query.url,
        'features': {
            'entities': {
                'sentiment': true,
                'limit': 2,
            }
        },
    };
    let sendSent = getNLUInstance().analyze(analyzesent)
    .then(response => {
        //let results= (JSON.stringify(response, null, 2));
        return res.send(JSON.stringify(response, null, 2));
  })
    .catch(err => {
        return res.send('error');
  });
});

app.get("/text/emotion", (req,res) => {
    let analyzeEmtion = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
            },
        'keywords': {
            'emotion': true,
            'sentiment': false,
            'limit': 4,
            },
        },
    };
    let sendEmtion = getNLUInstance().analyze(analyzeEmtion)
    .then(response => {
        //let results= (JSON.stringify(response, null, 2));
        return res.send(JSON.stringify(response, null, 2));
  })
    .catch(err => {
        return res.send('error');
  });
});

app.get("/text/sentiment", (req,res) => {
    let analyzeSentiment = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': false,
                'sentiment': true,
                'limit': 2,
            },
        'keywords': {
            'emotion': false,
            'sentiment': true,
            'limit': 4,
            },
        },
    };
    let sendSentiment = getNLUInstance().analyze(analyzeSentiment)
    .then(response => {
        //let results= (JSON.stringify(response, null, 2));
        return res.send(JSON.stringify(response, null, 2));
  })
    .catch(err => {
        return res.send('error');
  });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

