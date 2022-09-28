const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env;

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
);

//Send Mail
const sendEmail = (to, url, txt) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    });

    const accessToken = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "AFRICEQUIP MOCK WEB APP",
        html: `
        <div style="max-width: 700px; margin: auto; padding: 50px 20px; font-siz: 18px;">
            <h2 style="text-align: center; text-transform: uppercase; color: #23c4ec; font-weight: 500; font-size: 34px">
                AfricEquip
            </h2>
            <p>
            Congratulations! You're almost done, click on the link below to verify your account.
            </p>

            <a href=${url} style="background: blue; text-decoration: none; color: white; padding: 10px; font-size: 16px; text-align: center; margin: 35px auto;
            border-radius: 5px;
            ">${txt}</a>

            <p>Click on the link below if the button above isn't working</p>

            <div>${url}</div>
        </div>
        `
    };
    
    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if (err) return err;
        return infor
    })
}

module.exports = sendEmail