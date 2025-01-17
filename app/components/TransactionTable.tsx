import { select, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { TransactionWithItemAndUser } from "./StatsPage";
import { formatTransactionDate } from "../lib/utils";
import { MdDeleteForever } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { AsyncListData, useAsyncList } from "@react-stately/data";
import React, { Key, useEffect, useRef, useState } from "react";

interface Column {
    title: string,
    key: string
}

interface TransactionTableProps {
    transactions: TransactionWithItemAndUser[],
    columns: Column[],
    label: string,
    selectTransactionDeletion?: (transaction: TransactionWithItemAndUser) => void,
    selectTransactionInformation?: (transaction: TransactionWithItemAndUser) => void,
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



export function TransactionTable({ transactions, columns, label, selectTransactionDeletion, selectTransactionInformation }: TransactionTableProps) {
    const [isLoading, setIsLoading] = useState(true);

    let listRef = useRef<AsyncListData<TransactionWithItemAndUser> | null>(null);

    listRef.current = useAsyncList({
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
            listRef.current?.reload();
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
                        <div className="flex space-x-4">
                            { selectTransactionInformation && (
                            <Tooltip content="Information">
                                <span className="text-lg cursor-pointer active:opacity-50">
                                    <IoMdInformationCircleOutline onClick={() => selectTransactionInformation(transaction)} />
                                </span>
                            </Tooltip>
                            )}
                            {selectTransactionDeletion && (
                                <Tooltip color="danger" content="Ta bort transaktion">
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                        <MdDeleteForever onClick={() => selectTransactionDeletion(transaction)} />
                                    </span>
                                </Tooltip>
                            )}
                        </div>
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
                        {transaction.beeredTransaction ? `Ja (av ${transaction.beeredBy})` : "Nej"}
                    </p>
                )
        }
    }, [selectTransactionDeletion, selectTransactionInformation]);

    return (
        <Table
            aria-label={label}
            layout="fixed"
            isHeaderSticky
            classNames={{
                base: "max-h-[520px]",
            }}
            sortDescriptor={listRef.current.sortDescriptor}
            onSortChange={listRef.current.sort}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"} allowsSorting={column.key !== "actions"}>
                        {column.title}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={listRef.current.items}
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