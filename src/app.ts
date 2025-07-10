import express from "express";
import { MockEmailProviderA } from "./services/MockEmailProviderA";
import { MockEmailProviderB } from "./services/MockEmailProviderB";
import { EmailService } from "./services/EmailService";
import rateLimit from "express-rate-limit";
import { error } from "console";
import { EmailJob } from "./models/EmailJob";


const app = express();
app.use(express.json())

// Middleware for the rate limiting
const emailRateLimiter = rateLimit({
    max:10,     // Max 10 req per sec
    windowMs:60 * 1000, //1 sec
    message:{
        status:429,
        error:"Too many email request, Please try after sometime!",
    },
});

const emailProviderA = new MockEmailProviderA();
const emailProviderB = new MockEmailProviderB();

const emailService = new EmailService(emailProviderA, emailProviderB);


app.post('/send-email',emailRateLimiter, async (req, res) => {
    const {to, subject, body, id} = req.body as EmailJob;

    if(!to || !subject || !body || !id){
        return res.status(400).json({
            success: false,
            error: 'Missing Fields'
        });
    }

    const result = await emailService.sendEmail({to, subject, body, id});

    if(result == "duplicate"){
        return res.status(409).json({
            error:"Duplicate Job ID. Email already processed previously."
        });
    }

    if(result == "success"){
        return res.status(200).json({message: 'Email Send Successfully'});
    }
    else{
        return res.status(500).json({message: 'Failed to send email'});
    }
});

export default app;