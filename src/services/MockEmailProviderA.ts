import { EmailJob } from "../models/EmailJob";

export class MockEmailProviderA{
    async send(job: EmailJob): Promise<boolean>{
        if(Math.random() < 0.7){
            console.log("Email is send successfully by Email Provider A");
            return true;
        }
        else{
            throw new Error("Email Provider A failed to send email")
        }
    }
}