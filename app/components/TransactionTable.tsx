import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { TransactionWithItemAndUser } from "./StatsPage";
import { formatTransactionDate } from "../lib/utils";
import { MdDeleteForever } from "react-icons/md";
import React from "react";

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

export function TransactionTable({ transactions, columns, label, selectTransaction }: TransactionTableProps) {

    const renderCell = React.useCallback((transaction: TransactionWithItemAndUser, columnKey: React.Key) => {
        const cellValue = transaction[columnKey as keyof TransactionWithItemAndUser];

        console.log(cellValue);
        console.log(transaction);


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
        }
    }, []);

    return (
        <Table
            aria-label={label}
            layout="fixed"
            isHeaderSticky
            classNames={{
                base: "max-h-[520px] overflow-scroll",
            }}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
                        {column.title}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={transactions}>
                {(transaction: TransactionWithItemAndUser) => (
                    <TableRow key={transaction.id}>
                        {(columnKey) => <TableCell>{renderCell(transaction, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}