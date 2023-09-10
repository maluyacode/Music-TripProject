import express, { query } from "express"
import 'dotenv/config'
import QueryString from "qs";

const app = express();

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const port = process.env.SERVER_PORT
var redirect_uri = 'http://localhost:3000/token';


app.get('/login', (req, res) => {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-read-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        QueryString.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
})

app.get('/token', function (req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            QueryString.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
    }
});

app.listen(port, () => {
    console.log(`Server Started: http:/localhost:${port}`)
})

app.all('*', (req, res) => {

})


const generateRandomString = (length) => {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};