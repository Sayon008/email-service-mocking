import { resolve } from "path";
import { EmailJob } from "../models/EmailJob";

function sleep(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class EmailService{

    private MockEmailProviderA: any;
    private MockEmailProviderB: any;

    private maxRetries:number = 3;
    private baseDelay:number = 1000;

    private sentEmails: Set<String> = new Set();
    private emailStatus: Map<String, String> = new Map();

    constructor(MockEmailProviderA:any, MockEmailProviderB:any){
        this.MockEmailProviderA = MockEmailProviderA;
        this.MockEmailProviderB = MockEmailProviderB;
    }

    private async tryWithRetry(emailProvider: any, job:EmailJob):Promise<boolean>{
        for(let attempt=0;attempt < this.maxRetries;attempt++){
            try{
                console.log(`Attempt ${attempt + 1} to send via email provider`);
                
                const result = await emailProvider.send(job);

                if(result){
                    console.log('Email Send Successfully');
                    return true;
                }
            }
            catch(err){
                if(err instanceof Error){
                    console.warn(`Attemp ${attempt + 1} failed: ${err.message}`);
                }else{
                    console.log("Unknown:", err);
                }
            
                const delay = this.baseDelay * Math.pow(2, attempt);

                console.log(`Waiting for delay ${delay} ms before retrying`);

                await sleep(delay);
            }
        }

        console.log('All retry attemp failed');
        return false;
    }



    public async sendEmail(job: EmailJob): Promise<boolean>{

        if(this.sentEmails.has(job.id)){
            console.log(`Job Id alredy Present in the Queue ${job.id}`);
            return true;
        }
        
        console.log(`Sending Email via Email Provider A`);
        const successA = await this.tryWithRetry(this.MockEmailProviderA, job);
        

        if(successA){
            this.sentEmails.add(job.id);
            this.emailStatus.set(job.id, "sent");
            return true;
        }
        
        console.log("Trying with Email Provider B");
        const successB = await this.tryWithRetry(this.MockEmailProviderB,job);

        if(successB){
            this.sentEmails.add(job.id);
            this.emailStatus.set(job.id,"sent");
            return true;
        }

        this.emailStatus.set(job.id, "failed");
        return false;
    }

    public getStatus(id: String): String | undefined{
        return this.emailStatus.get(id);
    }
}