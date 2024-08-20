import { LightningElement, track, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import saveProduct from '@salesforce/apex/ProductController.saveProduct';
import deleteProduct from '@salesforce/apex/ProductController.deleteProduct';

const COLUMNS = [
    { label: 'Nome', fieldName: 'Name' },
    { label: 'Código', fieldName: 'ProductCode' },
    { label: 'Descrição', fieldName: 'Description__c' },
    { label: 'Preço', fieldName: 'Price__c' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions }
    }
];

const actions = [
    { label: 'Editar', name: 'edit' },
    { label: 'Deletar', name: 'delete' }
];

export default class ProductList extends LightningElement {
    @track products;
    @track columns = COLUMNS;
    @track isEditing = false;
    @track currentProduct = {};

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'edit') {
            this.currentProduct = { ...row };
            this.isEditing = true;
        } else if (actionName === 'delete') {
            this.deleteProduct(row.Id);
        }
    }

    handleChange(event) {
        const field = event.target.dataset.id;
        this.currentProduct[field] = event.target.value;
    }

    saveProduct() {
        saveProduct({ product: this.currentProduct })
            .then(() => {
                this.isEditing = false;
                this.currentProduct = {};
                return getProducts();
            })
            .then(result => {
                this.products = result;
            })
            .catch(error => {
                console.error(error);
            });
    }

    deleteProduct(productId) {
        deleteProduct({ productId })
            .then(() => {
                return getProducts();
            })
            .then(result => {
                this.products = result;
            })
            .catch(error => {
                console.error(error);
            });
    }

    createNewProduct() {
        this.currentProduct = {
            Name: '',
            ProductCode: '',
            Description__c: '',
            Price__c: 0
        };
        this.isEditing = true;
    }
}
