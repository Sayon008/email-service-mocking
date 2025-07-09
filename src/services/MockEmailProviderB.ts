import { EmailJob} from "../models/EmailJob";

export class MockEmailProviderB{
    async send(job: EmailJob): Promise<boolean>{
        if(Math.random() < 0.9){
            console.log("Email is send successfully by Email Provider B");
            return true;
        }
        else{
            throw new Error("Email Provider B failed to send email");
        }
    }
}