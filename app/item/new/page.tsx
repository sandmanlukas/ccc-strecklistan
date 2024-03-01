import React from 'react';
import AddItemForm from '../../components/AddItemForm';

async function AddItemPage({ children, }: { children: React.ReactNode }) {

    return (
        <AddItemForm />
    );
}

export default AddItemPage;