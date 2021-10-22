import { connect } from "net";

import superagent from "superagent";

export function printTcp(address: string, data: any) {
  return new Promise((resolve, reject) => {
    const socket = connect(9100, address.split(":")[0], () => {
      socket.end(data, () => resolve(undefined));
    });
    socket.on("error", reject);
  });
}

export function printHttp(url: string, data: any) {
  const printUrl = `${url}/pstprnt`;
  return superagent
    .post(printUrl)
    .timeout({
      response: 10000,
      deadline: 30000,
    })
    .send(data)
    .set("Content-Length", data.length);
}
