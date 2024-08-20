public with sharing class ProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts() {
        return [SELECT Id, Name, ProductCode, Description__c, Price__c FROM Product2];
    }
    
    @AuraEnabled
    public static Product2 getProductById(Id productId) {
        return [SELECT Id, Name, ProductCode, Description__c, Price__c FROM Product2 WHERE Id = :productId LIMIT 1];
    }
    
    @AuraEnabled
    public static void saveProduct(Product2 product) {
        upsert product;
    }
    
    @AuraEnabled
    public static void deleteProduct(Id productId) {
        Product2 product = [SELECT Id FROM Product2 WHERE Id = :productId LIMIT 1];
        delete product;
    }
}
