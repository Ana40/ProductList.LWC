public with sharing class ProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts() {
        return [SELECT Id, Name, Code__c, Description__c, Price__c FROM Product__c];
    }
    
    @AuraEnabled
    public static Product__c getProductById(Id productId) {
        return [SELECT Id, Name, Code__c, Description__c, Price__c FROM Product__c WHERE Id = :productId LIMIT 1];
    }
    
    @AuraEnabled
    public static void saveProduct(Product__c product) {
        upsert product;
    }
    
    @AuraEnabled
    public static void deleteProduct(Id productId) {
        Product__c product = [SELECT Id FROM Product__c WHERE Id = :productId LIMIT 1];
        delete product;
    }
}
