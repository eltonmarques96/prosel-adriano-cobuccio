import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthContext from "@/contexts/AuthContext";
import { useContext, useState } from "react";

const TransferValueDialog: React.FC = () => {
  const { loading, transferValue } = useContext(AuthContext);
  const [deposit, setDeposit] = useState(0);
  const [destinationWallet, setDestinationWallet] = useState("");
  async function depositFunction() {
    if (deposit >= 0) {
      await transferValue(destinationWallet, deposit);
    } else {
      alert("Valor Inválido");
    }
  }
  return (
    <>
      <Dialog>
        <DialogTrigger>Transferir Valor</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Informe o código da carteira e o valor da transferência (R$)
            </DialogTitle>
            <Label htmlFor="walletId">Carteira</Label>
            <Input
              type="text"
              disabled={loading}
              placeholder="Código da Carteira"
              id="walletId"
              required
              value={destinationWallet}
              onChange={(e) => setDestinationWallet(e.target.value)}
            />
            <Label htmlFor="walletId">Valor</Label>
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

export default TransferValueDialog;
