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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MockEmailProviderA_1 = require("./services/MockEmailProviderA");
const MockEmailProviderB_1 = require("./services/MockEmailProviderB");
const EmailService_1 = require("./services/EmailService");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Middleware for the rate limiting
const emailRateLimiter = (0, express_rate_limit_1.default)({
    max: 5, // Max 10 req per sec
    windowMs: 60 * 1000, //1 sec
    message: {
        status: 429,
        error: "Too many email request, Please try after sometime!",
    },
});
const emailProviderA = new MockEmailProviderA_1.MockEmailProviderA();
const emailProviderB = new MockEmailProviderB_1.MockEmailProviderB();
const emailService = new EmailService_1.EmailService(emailProviderA, emailProviderB);
app.post('/send-email', emailRateLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, subject, body, id } = req.body;
    if (!to || !subject || !body || !id) {
        return res.status(400).json({
            success: false,
            error: 'Missing Fields'
        });
    }
    const result = yield emailService.sendEmail({ to, subject, body, id });
    if (result == "duplicate") {
        return res.status(409).json({
            error: "Duplicate Job ID. Email already processed previously."
        });
    }
    if (result == "success") {
        return res.status(200).json({ message: 'Email Send Successfully' });
    }
    else {
        return res.status(500).json({ message: 'Failed to send email' });
    }
}));
app.get('/status/:id', (req, res) => {
    const status = emailService.getStatus(req.params.id);
    if (!status) {
        return res.status(404).json({ error: "Email Job not found!" });
    }
    return res.status(200).json({ status });
});
exports.default = app;
