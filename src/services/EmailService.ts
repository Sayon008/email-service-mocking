import { resolve } from "path";
import { EmailJob } from "../models/EmailJob";

export interface EmailProvider{
    send(job:EmailJob): Promise<boolean>;
}

function sleep(ms:number):Promise<void>{
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class EmailService{

    private maxRetries:number = 3;
    private baseDelay:number = 1000;

    private sentEmails: Set<string> = new Set();
    private emailStatus: Map<string, "sent" | "failed"> = new Map();

    constructor(private providerA: EmailProvider, private providerB: EmailProvider){
        this.providerA = providerA;
        this.providerB = providerB;
    }

    private async tryWithRetry(emailProvider: EmailProvider, job:EmailJob):Promise<boolean>{
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



    public async sendEmail(job: EmailJob): Promise<"duplicate" | "success" | "fail">{

        if(this.sentEmails.has(job.id)){
            console.warn(`Job Id alredy Present in the Queue ${job.id}`);
            return "duplicate";
        }
        
        console.log(`Sending Email via Email Provider A`);
        const successA = await this.tryWithRetry(this.providerA, job);
        

        if(successA){
            this.sentEmails.add(job.id);
            this.emailStatus.set(job.id, "sent");
            return "success";
        }
        
        console.log("Trying with Email Provider B");
        const successB = await this.tryWithRetry(this.providerB,job);

        if(successB){
            this.sentEmails.add(job.id);
            this.emailStatus.set(job.id,"sent");
            return "success";
        }

        this.emailStatus.set(job.id, "failed");
        return "fail";
    }

    public getStatus(id: string): "sent" | "failed" | undefined{
        return this.emailStatus.get(id);
    }
}