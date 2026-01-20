import useContractSocket from "../hooks/useContractSocket";

const { sendMessage } = useContractSocket(contractId, (data) => {
  console.log("received:", data);
});

