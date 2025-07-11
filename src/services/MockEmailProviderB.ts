import { EmailJob} from "../models/EmailJob";
import { Logger } from "../utils/Logger";
export class MockEmailProviderB{
    async send(job: EmailJob): Promise<boolean>{
        if(Math.random() < 0.9){
            Logger.info("Email is send successfully by Email Provider B");
            return true;
        }
        else{
            throw new Error("Email Provider B failed to send email");
        }
    }
}