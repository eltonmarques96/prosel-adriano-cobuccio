import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AuthContext from "@/contexts/AuthContext";
import { useContext, useState } from "react";

const AddBalanceDialog: React.FC = () => {
  const { loading, depositValue } = useContext(AuthContext);
  const [deposit, setDeposit] = useState(0);
  async function depositFunction() {
    if (deposit >= 0) {
      await depositValue(deposit);
    } else {
      alert("Valor Inválido");
    }
  }
  return (
    <>
      <Dialog>
        <DialogTrigger>Adicionar Saldo</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informe o valor do depósito (R$)</DialogTitle>
            <Input
              type="number"
              disabled={loading}
              placeholder="Valor do depósito"
              id="depositValue"
              required
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
            />
            <Button onClick={() => depositFunction()}>Salvar</Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddBalanceDialog;
