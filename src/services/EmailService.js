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
exports.EmailService = void 0;
const Logger_1 = require("../utils/Logger");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class EmailService {
    constructor(providerA, providerB) {
        this.providerA = providerA;
        this.providerB = providerB;
        this.maxRetries = 3;
        this.baseDelay = 1000;
        this.sentEmails = new Set();
        this.emailStatus = new Map();
        this.providerA = providerA;
        this.providerB = providerB;
    }
    tryWithRetry(emailProvider, job) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let attempt = 0; attempt < this.maxRetries; attempt++) {
                try {
                    Logger_1.Logger.info(`Attempt ${attempt + 1} to send via email provider`);
                    const result = yield emailProvider.send(job);
                    if (result) {
                        Logger_1.Logger.info('Email Send Successfully');
                        return true;
                    }
                }
                catch (err) {
                    if (err instanceof Error) {
                        Logger_1.Logger.warn(`Attemp ${attempt + 1} failed: ${err.message}`);
                    }
                    else {
                        Logger_1.Logger.info(`Unknown error Occured - ${err}`);
                    }
                    const delay = this.baseDelay * Math.pow(2, attempt);
                    Logger_1.Logger.info(`Waiting ${delay}ms before next retry (attemp ${attempt + 1})`);
                    yield sleep(delay);
                }
            }
            Logger_1.Logger.info('All retry attemp failed');
            return false;
        });
    }
    sendEmail(job) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sentEmails.has(job.id)) {
                Logger_1.Logger.warn(`Job Id alredy Present in the Queue ${job.id}`);
                return "duplicate";
            }
            Logger_1.Logger.info(`Sending Email via Email Provider A`);
            const successA = yield this.tryWithRetry(this.providerA, job);
            if (successA) {
                this.sentEmails.add(job.id);
                this.emailStatus.set(job.id, "sent");
                return "success";
            }
            yield sleep(500);
            Logger_1.Logger.info("Trying with Email Provider B");
            const successB = yield this.tryWithRetry(this.providerB, job);
            if (successB) {
                this.sentEmails.add(job.id);
                this.emailStatus.set(job.id, "sent");
                return "success";
            }
            this.emailStatus.set(job.id, "failed");
            return "fail";
        });
    }
    getStatus(id) {
        return this.emailStatus.get(id);
    }
}
exports.EmailService = EmailService;
