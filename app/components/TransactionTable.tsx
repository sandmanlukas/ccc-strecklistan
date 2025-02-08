import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { TransactionWithItemAndUser } from "./StatsPage";
import { formatTransactionDate } from "../lib/utils";
import { MdDeleteForever } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useAsyncList } from "@react-stately/data";
import React, { Key, useEffect, useState } from "react";
import { getAllTransactionsWithoutBeeredUser } from "../lib/getAllTransactionsWithoutBeeredUser";
import { TRANSACTION_PAGE_SIZE } from "./AdminPage";

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
    const [hasMore, setHasMore] = useState(true);

    let list = useAsyncList<TransactionWithItemAndUser>({
        async load({ signal, cursor }): Promise<{ items: TransactionWithItemAndUser[], cursor: string | undefined }> {
            try {
                const currentPage = cursor ? parseInt(cursor as string) : 1;
                const offset = (currentPage - 1) * TRANSACTION_PAGE_SIZE;
                const moreTransactions = await getAllTransactionsWithoutBeeredUser(true, null, TRANSACTION_PAGE_SIZE, offset);

                setHasMore(moreTransactions.length === TRANSACTION_PAGE_SIZE);
                setIsLoading(false);

                const items = currentPage === 1 ? transactions : [...list.items, ...moreTransactions];

                return {
                    items,
                    cursor: moreTransactions.length === TRANSACTION_PAGE_SIZE ? (currentPage + 1).toString() : undefined
                };
            } catch (error) {
                if (signal.aborted) {
                    console.warn('Request aborted');
                } else {
                    console.error("Failed to load transactions", error);
                }
                return { items: transactions, cursor: undefined };
            }
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
        if (transactions && list) {
            list?.reload();
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
                            {selectTransactionInformation && (
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
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
            bottomContent={
                hasMore && !isLoading ? (
                    <div className="flex w-full justify-center">
                        <Button
                            isDisabled={list.isLoading}
                            onClick={() => list.loadMore()}
                        >
                            {list.isLoading && <Spinner color="white" size="sm" />}
                            Ladda fler
                        </Button>
                    </div>
                ) : null
            }
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