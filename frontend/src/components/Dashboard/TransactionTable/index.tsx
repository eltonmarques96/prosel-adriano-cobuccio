import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { TransactionTypes } from "@/types/Transaction";

const TransactionsTable: React.FC = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Table>
        <TableCaption>Lista de Transferências</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[100px]">Tipo</TableHead>
            <TableHead className="w-[100px]">Valor</TableHead>
            <TableHead className="text-right">Devolver</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user?.wallets && user.wallets.length > 0 ? (
            user?.wallets[0]?.transactions?.map(
              (transaction: TransactionTypes, index: number) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: "left" }}>
                    {transaction.id || "N/A"}
                  </TableCell>
                  <TableCell style={{ textAlign: "left" }}>
                    {transaction.status || "N/A"}
                  </TableCell>
                  <TableCell style={{ textAlign: "left" }}>
                    {transaction.type || "N/A"}
                  </TableCell>
                  <TableCell style={{ textAlign: "left" }}>
                    R${(transaction.amount / 100000).toFixed(2) || "N/A"}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    <Button
                      className="btn btn-sm btn-info mr-2"
                      disabled={
                        transaction.type === "deposit" ||
                        transaction.receiver_wallet !== user.wallets[0].id
                      }
                    >
                      Devolver
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )
          ) : user ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Nenhuma transação encontrada
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Carregando...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TransactionsTable;
