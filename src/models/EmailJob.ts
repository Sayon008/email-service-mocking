export interface EmailJob{
    id:string;      //Handling idempotency with this
    to:string;
    subject:string;
    body:string;
}