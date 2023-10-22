/* global BigInt */
import { getEntityIdFromKeys, hexToAscii } from "@dojoengine/utils";
import { components } from "./components";

function parseData(value, type) {
  switch (typeof type) {
    case 'string':
      return hexToAscii(value)
    case 'number':
      return parseInt(value)
    case 'boolean':
      return Boolean(parseInt(value))
    default:
      return value
  }
}

export function translateEvent(event) {
  const name = hexToAscii(event[0])
  const keysNumber = parseInt(event[1]);
  const keys = event.slice(2, 2 + keysNumber).map((key) => BigInt(key));
  const entityId = getEntityIdFromKeys(keys);

  const component = components[name]
  const values = [...event.slice(2, 2 + keysNumber), ...event.slice(keysNumber + 4)]

  const parsedFields = Object.keys(component).reduce((acc, key, index) => {
    return { ...acc, [key]: parseData(values[index], component[key]) }
  }, {})

  return {
    entityId,
    componentName: name,
    ...parsedFields
  }
}