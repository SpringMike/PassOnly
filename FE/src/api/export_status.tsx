import axios from "axios";

type value = {
  export?: number;
  status?: number;
  code?: string;
};
type request = {
  id?: number;
  export?: number;
  status?: number;
  accountCreate?: number;
  accountSend?: number;
  accountReceive?: number;
  createAt?: string;
  dateSend?: string;
  dateReceive?: string;
};
export const getExportStatus = async () => {
  return (await axios.get(`http://localhost:8080/api/exportsStatus`)).data;
};
export const createExportStatus = async (item: value) => {
  return await axios.post(`http://localhost:8080/api/exportsStatus`, item);
};
export const findExportStatusById = async (id?: number) => {
  return (
    await axios.get(`http://localhost:8080/api/exportsStatus/getByExport/${id}`)
  ).data;
};
export const updateExportStatusById = async (id?: number, item?: request) => {
  return (
    await axios.put(`http://localhost:8080/api/exportsStatus/${id}`, item)
  ).data;
};
