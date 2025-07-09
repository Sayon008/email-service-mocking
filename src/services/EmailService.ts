import { EmailJob } from "../models/EmailJob";

export class EmailService{

    private MockEmailProviderA: any;
    private MockEmailProviderB: any;

    constructor(MockEmailProviderA:any, MockEmailProviderB:any){
        this.MockEmailProviderA = MockEmailProviderA;
        this.MockEmailProviderB = MockEmailProviderB;
    }

    async sendEmail(job: EmailJob): Promise<boolean>{
        try{
            console.log(`Sending Email to ${job.to} via Email Provider A`);
            return await this.MockEmailProviderA.send(job);
        }
        catch(err){
            console.warn(`Email Provider A failed ${err}, Trying with Email Provider B`);

            try{
                return await this.MockEmailProviderB.send(job);
            }
            catch(err2){
                console.warn(`Email Provider B also failed ${err2}`);
                return false;
            }
        }
    }
}