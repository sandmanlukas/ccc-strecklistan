import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { TransactionWithItemAndUser } from "./StatsPage";
import { formatTransactionDate } from "../lib/utils";
import { MdDeleteForever } from "react-icons/md";
import { useAsyncList } from "@react-stately/data";
import React, { Key, use, useEffect, useState } from "react";

interface Column {
    title: string,
    key: string
}

interface TransactionTableProps {
    transactions: TransactionWithItemAndUser[],
    columns: Column[],
    label: string,
    selectTransaction?: (transaction: TransactionWithItemAndUser) => void,
}

const sortDescriptorToValue = (sortDescriptor: Key | undefined, transaction: TransactionWithItemAndUser) => {
    switch (sortDescriptor) {
        case "name":
            return transaction.item.name;
        case "price":
            return transaction.price;
        case "createdAt":
            return transaction.createdAt;
        case "user":
            return transaction.user.username;
        case "beered":
            return transaction.beeredTransaction;
        default:
            return null;
    }
}



export function TransactionTable({ transactions, columns, label, selectTransaction }: TransactionTableProps) {
    const [isLoading, setIsLoading] = useState(true);
    
    let list = useAsyncList({
        async load() {
            setIsLoading(false);
            return { items: transactions };
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a, b) => {                    
                    let first = sortDescriptorToValue(sortDescriptor.column, a);
                    let second = sortDescriptorToValue(sortDescriptor.column, b);

                    if (first === null || second === null) {
                        return 0;
                    }

                    let cmp = first < second ? -1 : 1;
                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
    });

    useEffect(() => {
        if (transactions) {
            list.reload();
        }
    }, [transactions]);

    const renderCell = React.useCallback((transaction: TransactionWithItemAndUser, columnKey: React.Key) => {
        const cellValue = transaction[columnKey as keyof TransactionWithItemAndUser];

        switch (columnKey) {
            case "price":
                return (
                    `${cellValue} kr`
                );
            case "actions":
                return (
                    <>
                        {selectTransaction && (
                            <div className="flex justify-center items-center">
                                <Tooltip color="danger" content="Ta bort transaktion">
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                        <MdDeleteForever onClick={() => selectTransaction(transaction)} />
                                    </span>
                                </Tooltip>
                            </div>
                        )}
                    </>
                );
            case "createdAt":
                return (
                    <p>
                        {formatTransactionDate(transaction.createdAt)}
                    </p>
                )
            case "name":
                return (
                    <p>
                        {transaction.item.name}
                    </p>
                )
            case "user":
                return (
                    <p>
                        {transaction.user.username}
                    </p>
                )
            case "beered":
                return (
                    <p>
                        {transaction.beeredTransaction ? "Ja" : "Nej"}
                    </p>
                )
        }
    }, [selectTransaction]);

    return (
        <Table
            aria-label={label}
            layout="fixed"
            isHeaderSticky
            classNames={{
                base: "max-h-[520px] overflow-scroll",
            }}
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"} allowsSorting={column.key !== "actions"}>
                        {column.title}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={list.items}
                isLoading={isLoading}
                loadingContent={<Spinner label="Laddar transaktioner..." />}
            >
                {(transaction: TransactionWithItemAndUser) => (
                    <TableRow key={transaction.id}>
                        {(columnKey) => <TableCell>{renderCell(transaction, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}