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
exports.MockEmailProviderA = void 0;
const Logger_1 = require("../utils/Logger");
class MockEmailProviderA {
    send(job) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Math.random() < 0.5) {
                Logger_1.Logger.info("Email is send successfully by Email Provider A");
                return true;
            }
            else {
                throw new Error("Email Provider A failed to send email");
            }
        });
    }
}
exports.MockEmailProviderA = MockEmailProviderA;
