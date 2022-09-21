import { api, LightningElement, wire} from 'lwc';
import fetchTeamsNames from '@salesforce/apex/TeamController.fetchTeams';
import fetchTeamMemberDetails from '@salesforce/apex/TeamController.fetchTeamMembers';
export default class TeamList extends LightningElement {
    options = [];
    lstData = [];
    selectedTeamId='';
    selectedTeamName = '';
    isMemberNotFound = false;
    isMemberFound = false;

    @wire(fetchTeamsNames,{})
    processTeams({data,error}){
        if(data){
            console.log('processTeams : data :: ',data);
            let tempdata = JSON.parse(JSON.stringify(data));
            let tempLstOptions = new Array();
            tempdata.forEach(element => {
                tempLstOptions.push({label: ((element.Name)),value: ((element.Id))});
            });
            console.log('tempLstOptions :: ',tempLstOptions);
            this.options = [...tempLstOptions];
        }else if(error){
            console.log('processTeams : error :: ',error);
        }
    }

    @api
    newMemberAdded(data){
        console.log('newMemberAdded method called : ',data);
        let tempObj = data;
        console.log('tempObj :: ',tempObj);
        let dataObj = JSON.parse(tempObj);
        if(dataObj.teamId == this.selectedTeamId){
            let tempArr = [...this.lstData];
            tempArr.push({name: dataObj.name,skills : dataObj.skills});
            this.lstData = [...tempArr];
        }else{
            this.selectedTeamId = dataObj.teamId;
            this.processTeamMembers();
        }
        
    }
    handleOnChange(event){
        console.log('handleOnChange method called');
        this.selectedTeamId = event.target.value;
        
        this.processTeamMembers();
    }
    processTeamMembers(){
        this.options.forEach(element => {
            if(element.value == this.selectedTeamId)
                this.selectedTeamName  = element.label;
        });
        console.log('this.selectedTeamName :: ',this.selectedTeamName);
        
        fetchTeamMemberDetails({teamId:this.selectedTeamId})
        .then((result=>{
            console.log('handleOnChange : result : ',result);
            if(result.length<=0){
                this.isMemberNotFound = true;
                this.isMemberFound = false;
                return;
            }
            this.isMemberFound = true;
            this.isMemberNotFound = false;
            let tempArr = [];
            result.forEach(element => {
                tempArr.push({name: element.Name,skills : element.Skills__c});
            });
            this.lstData = [...tempArr];
            console.log('this.lstData  :: ',this.lstData );
        }))
        .catch((error)=>{
            console.log('handleOnChange : error : ',error);
        })
    }
}