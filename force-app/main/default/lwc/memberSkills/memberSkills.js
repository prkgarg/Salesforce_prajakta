import { LightningElement, wire } from 'lwc';
import fetchTeamsNames from '@salesforce/apex/TeamController.fetchTeams';
import saveNewMember from '@salesforce/apex/TeamController.insertNewMember';
export default class MemberSkills extends LightningElement {
    options = [];//use to show the combox options
    selectedTeamId='';
    teamMemberName = '';
    teamMemberSkills = '';
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
    handleOnChange(event){
        console.log('handleOnChange method called');
        console.log('handleOnChange :: ',event);
        console.log('handleOnChange value :: ',event.target.value);
        console.log('handleOnChange name :: ',event.target.name);
        if(event.target.name=='skillsInput'){
            this.teamMemberSkills = event.target.value;
        }
        if(event.target.name=='memberName'){
            this.teamMemberName = event.target.value;
        }
        if(event.target.name=='team'){
            this.selectedTeamId = event.target.value;
        }
    }
    handleClick(event){
        console.log('handleClick method called ');
        saveNewMember({teamId : this.selectedTeamId, memberName : this.teamMemberName, skills : this.teamMemberSkills})
        .then((result)=>{
            console.log('saveNewMember : result : ',result);
            let tempObj = {name:this.teamMemberName,skills:this.teamMemberSkills,teamId: this.selectedTeamId};
            this.dispatchEvent(new CustomEvent('newmember',{detail:tempObj}));
            this.teamMemberName = '';
            this.teamMemberSkills = '';
            this.selectedTeamId = '';
            
        })
        .catch((error)=>{
            console.log('saveNewMember : error : ',error);
        })
    }
}