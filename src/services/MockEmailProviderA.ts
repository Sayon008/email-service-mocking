import { EmailJob } from "../models/EmailJob";
import { Logger } from "../utils/Logger";
export class MockEmailProviderA{
    async send(job: EmailJob): Promise<boolean>{
        if(Math.random() < 0.5){
            Logger.info("Email is send successfully by Email Provider A");
            return true;
        }
        else{
            throw new Error("Email Provider A failed to send email")
        }
    }
}