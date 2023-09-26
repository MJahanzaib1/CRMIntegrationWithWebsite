import { LightningElement, track } from 'lwc';
import fetchAllObjects from '@salesforce/apex/RandomRecordAudit.fetchAllObjects';
import fetchAllFields from '@salesforce/apex/RandomRecordAudit.fetchAllFields';

export default class SObjectList extends LightningElement {
        @track objectsList = [];
        @track error;
        @track selectedObject; 
        @track fieldsList = [];
        @track selectedField; 
        @track isSelected = false;
    
        connectedCallback() {
            fetchAllObjects()
                .then(result => {
                        for (let key in result){
                            const temp = [{label:key, value:key}];
                            this.objectsList = [...this.objectsList,...temp];
                        }
                })
                .catch(error => {
                    console.log('Error in getting objects') 
                });
        }

        salesforceObjectChange(event){
            this.selectedObject = event.detail.value;
            console.log(this.selectedObject);
            fetchAllFields( {objectName : this.selectedObject}).then(result => {
                    for(let key in result){
                        const temp = [{label:key, value:key}];
                        this.fieldsList= [...this.fieldsList, ...temp];
                        console.log(key);
                    }
                })
                .catch(error => {
                    console.log('Error in getting fields')
                });
            this.isSelected = true;

        }
        salesforceFieldChange(event){
            this.selectedField = event.detail.value;
        }

}