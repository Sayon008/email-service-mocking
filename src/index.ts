import express from "express";
import { MockEmailProviderA } from "./services/MockEmailProviderA";
import { MockEmailProviderB } from "./services/MockEmailProviderB";
import { EmailService } from "./services/EmailService";
import rateLimit from "express-rate-limit";
import { error } from "console";


const app = express();
app.use(express.json())

// Middleware for the rate limiting
const emailRateLimiter = rateLimit({
    max:10,
    windowMs:60 * 1000,
    message:{
        status:429,
        error:"Too many email request, Please try after sometime!",
    },
});

const emailProviderA = new MockEmailProviderA();
const emailProviderB = new MockEmailProviderB();

const emailService = new EmailService(emailProviderA, emailProviderB);


app.post('/send-email',emailRateLimiter, async (req, res) => {
    const {to, subject, body, id} = req.body;

    if(!to || !subject || !body || !id){
        return res.status(400).json({error: 'Missing Fields'});
    }

    const result = await emailService.sendEmail({to, subject, body, id});


    if(result){
        return res.status(200).json({message: 'Email Send Successfully'});
    }
    else{
        res.status(500).json({message: 'Failed to send email'});
    }
});

app.listen(3000, () => {
    console.log('Application Running on http://localhost:3000');
});