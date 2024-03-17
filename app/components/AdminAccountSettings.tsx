"use client"

import React from "react";

import { Account } from "@prisma/client";
import { ListboxWrapper } from "@/app/components/ListboxWrapper";
import AdminAccountCard from "@/app/components/AdminAccountCard";
import { Listbox, ListboxItem, Selection } from "@nextui-org/react";

export function AdminAccountSettings({ accs }: { accs: Account[] }) {
    const [accounts, setAccounts] = React.useState<Account[]>(accs);
    const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(accs[0] || null);
    const [selectedAccountKey, setSelectedAccountKey] = React.useState<Selection>(new Set([accounts[0]?.id.toString()]));

    const handleAccountUpdate = (updatedAccount: Account) => {
        setAccounts(currentAccount => {
            return currentAccount.map(account => {
                if (account.id === updatedAccount.id) {
                    return updatedAccount; // Return the updated account
                }
                return account; // Return the unchanged account
            });
        });
    }

    return (
        <div className="grid grid-cols-[1fr_2fr] gap-4">
            <div className="">
                <ListboxWrapper>
                    <Listbox
                        aria-label="Konton i systemet"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        items={accounts}
                        selectedKeys={selectedAccountKey}
                        onSelectionChange={setSelectedAccountKey}
                        classNames={{
                            base: "max-w-xs",
                            list: "max-h-[300px] overflow-scroll",
                        }}
                    >
                        {(account) => (
                            <ListboxItem key={account.id} textValue={account.username} onClick={() => setSelectedAccount(account)}>
                                <div className="flex gap-2 s-center">
                                    <div className="flex flex-col">
                                        <span className="text-small">{account.username}</span>
                                    </div>
                                </div>
                            </ListboxItem>
                        )}
                    </Listbox>
                </ListboxWrapper>
            </div>
            <AdminAccountCard account={selectedAccount} onAccountUpdate={handleAccountUpdate} />
        </div>
    );
}