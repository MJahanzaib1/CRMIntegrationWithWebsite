public with sharing class HandlingClientClass {
    @AuraEnabled (cacheable=true)
    public static void storingAuthData(String clientId, String secretKey, String authToken){
        try{
            Client__c client = new Client__c();
            client.Client_id__c = clientId;
            client.Secret_Key__c = secretKey;
            client.Integration_Verification_Token__c = authToken;
            upsert client;
        } catch(Exception e){
            throw e;
        }
    }
}