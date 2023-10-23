import { RPCProvider } from "@dojoengine/core";
import { useBurner } from "@dojoengine/create-burner";
import { getEvents } from "@dojoengine/utils";
import React, { createContext, useState } from "react";
import { Account, RpcProvider } from "starknet";
import { translateEvent } from "../helpers/events";
import { useSnackbar } from "notistack";
import manifest from '../helpers/manifest.json'

const WORLD_ADDRESS = "0x1586ea3ec67a7f52e6a08294461881acd1ec3a6195dcd43b7fd839f272214ff"
const MASTER_ADDRESS = "0x4310144d4b224ce6ad26c8d9452211f92dfd7169341568f0c79ef4f08ff3561"
const MASTER_PRIVATE_KEY = "0x4be7353a0ff26fec8d279b06a6e62ec06cac946912080dc9941391a1f8c9662"
const NODE_URL = "https://api.cartridge.gg/x/block-droid/katana"

export const DojoContext = createContext()

export const DojoProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()

  const starkProvider = new RpcProvider({ nodeUrl: NODE_URL })
  const dojoProvider = new RPCProvider(WORLD_ADDRESS, manifest, NODE_URL);

  const [account] = useState(new Account(starkProvider, MASTER_ADDRESS, MASTER_PRIVATE_KEY))

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
        executeTx,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};