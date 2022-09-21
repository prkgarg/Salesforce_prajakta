public class TeamController {
    @AuraEnabled(cacheable=true scope='global')
    public static List<Team__c> fetchTeams(){
        try{
            List<Team__c> lst = [SELECT ID,NAME FROM Team__c];
            return lst;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @auraEnabled
    public static void insertNewMember(String teamId, String memberName, String skills){
        try {
            if(String.isNotBlank(teamId) && String.isNotBlank(memberName) && String.isNotBlank(skills)){
                INSERT new Team_Member__c(Name=memberName, Skills__c = skills, Team__c = teamId);
            }else {
                throw new CustomException('Please fill all the values');   
            }
                
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<Team_Member__c> fetchTeamMembers(String teamId){
        try {
            return [SELECT Id, Name, Team__c, Skills__c FROM Team_Member__c WHERE Team__c =:teamId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    private class CustomException extends Exception {}
}