import { EmailService } from "../src/services/EmailService";
import { EmailJob } from "../src/models/EmailJob";

class FakeEmailProvider{
    failcount = 0;
    succeedAfter = 0;


    constructor(succeedAfter: number = 0){
        this.succeedAfter = succeedAfter;
    }

    async send(job: EmailJob): Promise<boolean>{
        if(this.failcount < this.succeedAfter){
            this.failcount++;
            throw new Error("Sending Failed");
        }

        return true;    // Send succeeded

    }
}

//Test Sending Success

test("should send email successfully with the first provider", async () => {
    const providerA = new FakeEmailProvider();      // Always succeed
    const providerB = new FakeEmailProvider();      // Not used

    const emailService = new EmailService(providerA, providerB);

    const job: EmailJob = {
        id:"test-1",
        to: "test1@gmail.com",
        subject: "Testing Email Provider A",
        body: "This is a test"
    };

    const result = await emailService.sendEmail(job);
    expect(result).toBe("success");
});



// Test Retry Logic Before Success

test("should retry on failure and it should succeed", async () => {
    const providerA = new FakeEmailProvider(2);
    const providerB = new FakeEmailProvider();

    const emailService = new EmailService(providerA, providerB);
    
    const job:EmailJob ={
        id:"test-retry-1",
        to:"test1@gmail.com",
        subject:"Testing the retry functionality",
        body:"Testing retries"
    };

    const result = await emailService.sendEmail(job);
    expect(result).toBe("success");
});


// Test Fallback to Provider B

test("should fallback to Provide B when Provider A fails", async () => {

    const providerA = new FakeEmailProvider(5);  // Fail 5 times
    const providerB = new FakeEmailProvider();    // Succeed at first try

    const emailService = new EmailService(providerA, providerB);
    
    const job : EmailJob ={
        id:"fallback-test-1",
        to:"test1@gmail.com",
        subject:"Testing Fallback Functionality",
        body:"Testing fallback to Provide B when A fails to send email"
    };

    const result = await emailService.sendEmail(job);

    expect(result).toBe("success");
});


// Test Duplicate Job - Idempotency Check

test("should resend an email with duplicate job-id", async () => {

    const providerA = new FakeEmailProvider();
    const providerB = new FakeEmailProvider();

    const emailService = new EmailService(providerA, providerB);

    const job: EmailJob = {
        id: "test-duplicate-1",
        to:"test1@gmail.com",
        subject:"Check for duplicate job-id",
        body: " Testing duplicate job-id"
    };

    const firsSend = await emailService.sendEmail(job);
    expect(firsSend).toBe("success");

    const secondSend = await emailService.sendEmail(job);
    expect(secondSend).toBe("duplicate");
});