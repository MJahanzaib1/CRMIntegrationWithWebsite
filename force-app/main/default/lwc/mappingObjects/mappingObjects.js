import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MappingObjects extends LightningElement {
    @track oneVestValue;
    @track salesforceValue;
    @track isObjectEdited = false;
    @track isFieldEdited = false;
    @track isObjectComboboxOpen = false;
    @track isFieldComboboxOpen = false;
    @track isObjectSelected = false;
    @track salesforceFieldValue;
    @track oneVestFieldValue;
    @track jsonObject = {};
    @track isObjectMapped = false;

    oneVestOptions = [
        { label: 'Option A', value: 'optionA' },
        { label: 'Option B', value: 'optionB' },
        { label: 'Option C', value: 'optionC' },
        { label: 'Option X', value: 'optionX' },
        { label: 'Option Y', value: 'optionY' },
        { label: 'Option Z', value: 'optionZ' },
    ];

    salesforceOptions = [
        { label: 'Option X', value: 'optionX' },
        { label: 'Option Y', value: 'optionY' },
        { label: 'Option Z', value: 'optionZ' },
        { label: 'Option X', value: 'optionX' },
        { label: 'Option Y', value: 'optionY' },
        { label: 'Option Z', value: 'optionZ' },
        { label: 'Option X', value: 'optionX' },
        { label: 'Option Y', value: 'optionY' },
        { label: 'Option Z', value: 'optionZ' },
        { label: 'Option X', value: 'optionX' },
        { label: 'Option Y', value: 'optionY' },
        { label: 'Option Z', value: 'optionZ' },
    ];

    salesforceObjectFields = [
        { label: 'Option X', value: 'optionX' },
        { label: 'Option Y', value: 'optionY' },
        { label: 'Option Z', value: 'optionZ' },
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ];

    oneVestObjectFields = [
        { label: 'Option A', value: 'optionA' },
        { label: 'Option B', value: 'optionB' },
        { label: 'Option C', value: 'optionC' },
        { label: 'Option X', value: 'optionX' },
        { label: 'Option Y', value: 'optionY' },
        { label: 'Option Z', value: 'optionZ' },
    ];

    handleOneVestChange(event) {
        this.isObjectEdited = true;
        this.oneVestValue = event.detail.value;
    }

    handleSalesforceChange(event) {
        this.isObjectEdited = true;
        this.salesforceValue = event.detail.value;
    }

    handleOneVestFieldChange(event) {
        this.isFieldEdited = true;
        this.oneVestFieldValue = event.detail.value;
    }

    handleSalesforceFieldChange(event) {
        this.isFieldEdited = true;
        this.salesforceFieldValue = event.detail.value;
    }

    handleObjectComboboxFocus() {
        this.isObjectComboboxOpen = true;
        this.objectMarginChange();
    }

    handleObjectComboboxBlur() {
        this.isObjectComboboxOpen = false;
        this.objectMarginChange();
    }

    handleFieldComboboxFocus() {

        this.isFieldComboboxOpen = true;
        this.fieldMarginChange();
    }

    handleFieldComboboxBlur() {
        this.isFieldComboboxOpen = false;
        this.fieldMarginChange();
    }

    objectMarginChange() {
        const comboBox = this.template.querySelector('.object-horizontal-container');
        if (this.isObjectComboboxOpen) {
            const maxOptions = this.oneVestOptions.length > this.salesforceOptions.length ? this.oneVestOptions.length : this.salesforceOptions.length;
            const margin = maxOptions * 35 + 10;
            comboBox.style.marginBottom = `${margin}px`;
        }
        else {
            comboBox.style.marginBottom = '10px';
        }
    }

    fieldMarginChange() {
        const comboBox = this.template.querySelector('.fields-horizontal-container');
        if (this.isFieldComboboxOpen) {
            const maxOptions = this.oneVestObjectFields.length > this.salesforceObjectFields.length ? this.oneVestObjectFields.length : this.salesforceObjectFields.length;
            const margin = maxOptions * 35 + 10;
            comboBox.style.marginBottom = `${margin}px`;
        }
        else {
            comboBox.style.marginBottom = '10px';
        }
    }

    matchObject() {
        if (this.oneVestValue === undefined || this.salesforceValue === undefined) {
            this.dispatchEvent(this.dispatchToastEvent('Error!', 'Must Fill all the Fields!', 'error'));
        }
        else {
            try {
                if(this.objectMapping()){
                    this.dispatchToastEvent('Success', 'Moving forward for Fields Matching', 'success');
                    this.isObjectEdited = false;
                    this.isObjectSelected = true;
                }else{
                this.dispatchToastEvent('Error!', 'Select the unmapped objects', 'error');
                    this.isObjectEdited = true;
                }
                //this.oneVestValue = this.salesforceValue = '';
            } catch (error) {
                this.dispatchToastEvent('Error!', 'Failed to save', 'error');
                this.isObjectEdited = true;
            }
        }
    }

    objectMapping(){
        if (this.jsonObject.hasOwnProperty(this.salesforceValue)) {
            //Salesforce object already mapped
            this.dispatchToastEvent('Error!', 'Salesforce Object has already been mapped', 'error');
            return false;
        }
        else if (Object.values(this.jsonObject).some(obj => obj.hasOwnProperty(this.oneVestValue))) {
            //One Vest Object is already mapped with some other Salesforce Object
            this.dispatchToastEvent('Error!', 'OneVest Object has already been mapped', 'error');
            return false;
        }
        else if (!this.isObjectMapped) {
            //first time when no fields mapping 
            this.jsonObject[this.salesforceValue] = {};
            this.jsonObject[this.salesforceValue][this.oneVestValue] = {}
            this.isObjectMapped = true;
            return true;
        }
    }
    matchField() {
        this.jsonObject[this.salesforceValue][this.oneVestValue][this.salesforceFieldValue] = this.oneVestFieldValue;
        this.salesforceObjectFields = this.salesforceObjectFields.filter(obj => obj.value !== this.salesforceFieldValue);
        this.oneVestObjectFields = this.oneVestObjectFields.filter(obj => obj.value !== this.oneVestFieldValue);
        if (this.salesforceObjectFields.length === 0 || this.oneVestObjectFields.length === 0) {
            this.isObjectSelected = false;
            this.isFieldEdited = false;
            this.isObjectMapped = false;
            this.salesforceObjectFields = [
                { label: 'Option X', value: 'optionX' },
                { label: 'Option Y', value: 'optionY' },
                { label: 'Option Z', value: 'optionZ' },
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
                { label: 'Option X', value: 'optionX' },
                { label: 'Option Y', value: 'optionY' },
                { label: 'Option Z', value: 'optionZ' },
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
                { label: 'Option X', value: 'optionX' },
                { label: 'Option Y', value: 'optionY' },
                { label: 'Option Z', value: 'optionZ' },
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
            ];

            this.oneVestObjectFields = [
                { label: 'Option A', value: 'optionA' },
                { label: 'Option B', value: 'optionB' },
                { label: 'Option C', value: 'optionC' },
                { label: 'Option X', value: 'optionX' },
                { label: 'Option Y', value: 'optionY' },
                { label: 'Option Z', value: 'optionZ' },
            ];
            this.oneVestValue = this.salesforceValue = '';
        }
    }


    dispatchToastEvent(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(toastEvent);
    }
}