import DashboardLayout from "../layout";

function Wallet() {
  return (
    <>
      <button>Adicionar Saldo</button>
    </>
  );
}

Wallet.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Wallet;
