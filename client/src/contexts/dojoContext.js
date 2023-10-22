import { RPCProvider } from "@dojoengine/core";
import { useBurner } from "@dojoengine/create-burner";
import { getEvents } from "@dojoengine/utils";
import React, { createContext, useState } from "react";
import { Account, RpcProvider } from "starknet";
import { translateEvent } from "../helpers/events";
import { useSnackbar } from "notistack";
import manifest from '../helpers/manifest.json'

const WORLD_ADDRESS = "0x7bfc4dc34e5e8a3c7c29604134dbf6e0e9f133aa6431d1aa69d5f08164e67b6"
const MASTER_ADDRESS = "0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973"
const MASTER_PRIVATE_KEY = "0x1800000000300000180000000000030000000000003006001800006600"
const CLASH_HASH = "0x04d07e40e93398ed3c76981e72dd1fd22557a78ce36c0515f679e27f0bb5bc5f"
const NODE_URL = "http://localhost:5050"

export const DojoContext = createContext()

export const DojoProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()

  const starkProvider = new RpcProvider({ nodeUrl: NODE_URL })
  const dojoProvider = new RPCProvider(WORLD_ADDRESS, manifest, NODE_URL);

  const [masterAccount] = useState(new Account(starkProvider, MASTER_ADDRESS, MASTER_PRIVATE_KEY))
  const { create, isDeploying } = useBurner({ masterAccount: masterAccount, accountClassHash: CLASH_HASH });

  const [account, setAccount] = useState()

  
  const createBurner = async () => {
    const burnerAcc = await create()
    console.log('Burner created', burnerAcc)
    setAccount(burnerAcc)
  }

  const executeTx = async (contract_name, system, call_data, success_msg) => {
    if (!account) {
      enqueueSnackbar('No wallet connected', { variant: 'warning', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
      return 
    }

    const tx = await dojoProvider.execute(account, contract_name, system, call_data || [])

    const receipt = await account.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

    if (receipt.execution_status === "REVERTED") {
      enqueueSnackbar('Transaction reverted', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
      return
    }

    if (success_msg) {
      return enqueueSnackbar(success_msg, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    }

    const events = getEvents(receipt)

    const translatedEvents = events.map(event => translateEvent(event.data))

    return translatedEvents
  }

  return (
    <DojoContext.Provider
      value={{
        address: account?.address,
        isDeploying,
        executeTx,
        createBurner
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};