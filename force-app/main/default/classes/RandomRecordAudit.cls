public with sharing class RandomRecordAudit {
    
    @AuraEnabled(cacheable = true)
    public static map<string, string> fetchAllObjects(){
        map<string, string> objectList = new map<string, string>();
        for ( Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values() )
        {
            string name = objTyp.getDescribe().getLocalName();
            string label = objTyp.getDescribe().getLabel();
            objectList.put(name,label);  
        }
        return objectList;
    } 

    @AuraEnabled(cacheable = true)
    public static map<string, string> fetchAllFields(string objectName){
        system.debug('Inside fetchAllFields 1');
        map<string, Schema.SObjectType> detail = Schema.getGlobalDescribe();
        system.debug('Inside fetchAllFields 2');
        map<string, string> fieldsList = new map<string, string>();
        system.debug('Inside fetchAllFields 3');
        for ( Schema.SObjectField fields: detail.get(objectName).getDescribe().fields.getMap().Values() )
        {
            system.debug('Inside fetchAllFields 4');
            fieldsList.put(fields.getDescribe().getName(),fields.getDescribe().getName());
            system.debug(fields.getDescribe().getName());
        }
        return fieldsList;
    } 
}