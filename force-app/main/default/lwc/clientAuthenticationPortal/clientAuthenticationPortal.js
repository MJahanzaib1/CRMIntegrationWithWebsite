import { LightningElement , track,} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import storeCredentials from '@salesforce/apex/HandlingClientClass.storingAuthData';

export default class ClientAuthenticationPortal extends LightningElement {
    @track clientId;
    @track secretKey;
    @track integrationVerificationToken;
    @track edited = false;

    storeClientId(event){
        this.edited = true;
        this.clientId = event.target.value;
    }

    storeSecretKey(event){
        this.edited = true;
        this.secretKey = event.target.value;
    }

    storeIntegrationVerificationToken(event){
        this.edited = true;
        this.integrationVerificationToken = event.target.value;
    }
    cancel(){
        console.log('Cancel Button Clicked')
    }

    save(event){
        console.log('Inside Save Function');
        if(this.clientId === undefined || this.secretKey === undefined ){
            const toastEvent = new ShowToastEvent({
                title:'Error!',
                message:'Must Fill all the Fields!',
                variant:'warning'
            });
            this.dispatchEvent(toastEvent);
        }else
        //save the Authentication Data in database
        {
            event.preventDefault();
            //storeCredentials(this.clientId, this.secretKey, this.integrationVerificationToken);
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Data Saved in Database',
                variant:'success'
            });
            this.dispatchEvent(toastEvent);

        }
    }

    
}