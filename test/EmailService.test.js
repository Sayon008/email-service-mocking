"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("../src/services/EmailService");
class FakeEmailProvider {
    constructor(succeedAfter = 0) {
        this.failcount = 0;
        this.succeedAfter = 0;
        this.succeedAfter = succeedAfter;
    }
    send(job) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.failcount < this.succeedAfter) {
                this.failcount++;
                throw new Error("Sending Failed");
            }
            return true; // Send succeeded
        });
    }
}
//Test Sending Success
test("should send email successfully with the first provider", () => __awaiter(void 0, void 0, void 0, function* () {
    const providerA = new FakeEmailProvider(); // Always succeed
    const providerB = new FakeEmailProvider(); // Not used
    const emailService = new EmailService_1.EmailService(providerA, providerB);
    const job = {
        id: "test-1",
        to: "test1@gmail.com",
        subject: "Testing Email Provider A",
        body: "This is a test"
    };
    const result = yield emailService.sendEmail(job);
    expect(result).toBe("success");
}));
// Test Retry Logic Before Success
test("should retry on failure and it should succeed", () => __awaiter(void 0, void 0, void 0, function* () {
    const providerA = new FakeEmailProvider(2);
    const providerB = new FakeEmailProvider();
    const emailService = new EmailService_1.EmailService(providerA, providerB);
    const job = {
        id: "test-retry-1",
        to: "test1@gmail.com",
        subject: "Testing the retry functionality",
        body: "Testing retries"
    };
    const result = yield emailService.sendEmail(job);
    expect(result).toBe("success");
}));
// Test Fallback to Provider B
test("should fallback to Provide B when Provider A fails", () => __awaiter(void 0, void 0, void 0, function* () {
    const providerA = new FakeEmailProvider(5); // Fail 5 times
    const providerB = new FakeEmailProvider(); // Succeed at first try
    const emailService = new EmailService_1.EmailService(providerA, providerB);
    const job = {
        id: "fallback-test-1",
        to: "test1@gmail.com",
        subject: "Testing Fallback Functionality",
        body: "Testing fallback to Provide B when A fails to send email"
    };
    const result = yield emailService.sendEmail(job);
    expect(result).toBe("success");
}));
// Test Duplicate Job - Idempotency Check
test("should resend an email with duplicate job-id", () => __awaiter(void 0, void 0, void 0, function* () {
    const providerA = new FakeEmailProvider();
    const providerB = new FakeEmailProvider();
    const emailService = new EmailService_1.EmailService(providerA, providerB);
    const job = {
        id: "test-duplicate-1",
        to: "test1@gmail.com",
        subject: "Check for duplicate job-id",
        body: " Testing duplicate job-id"
    };
    const firsSend = yield emailService.sendEmail(job);
    expect(firsSend).toBe("success");
    const secondSend = yield emailService.sendEmail(job);
    expect(secondSend).toBe("duplicate");
}));
