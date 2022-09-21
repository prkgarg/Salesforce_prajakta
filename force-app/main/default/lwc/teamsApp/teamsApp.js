import { LightningElement } from 'lwc';

export default class TeamsApp extends LightningElement {
    onAddMember(event){
        console.log('onAddMember method called');
        console.log('onAddMember : event :: ',event.detail);
        this.template.querySelector('c-team-list').newMemberAdded(JSON.stringify(event.detail));
    }
}