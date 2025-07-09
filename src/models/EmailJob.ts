export interface EmailJob{
    id:String;      //Handling idempotency with this
    to:String;
    subject:String;
    body:String;
}