import React from 'react';
import RecentTransactions from '../components/RecentTransactions';

interface RecentTransactionsPageProps {
    // Add any props you need for your Page component
}

const RecentTransactionsPage: React.FC<RecentTransactionsPageProps> = () => {
    return (
        <RecentTransactions />
    );
};

export default RecentTransactionsPage;