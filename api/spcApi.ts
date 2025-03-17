import axios from 'axios';
import { format } from 'date-fns';

// const BASE_URL = 'http://172.16.5.24:8305/api';
// const BASE_URL = 'http://localhost:8305/api';
const BASE_URL = 'http://10.10.1.7:8304/api';

export const fetchShiftData = async () => {
  const response = await axios.get(`${BASE_URL}/commonappservices/getshiftdatalist`);
  return response.data;
};

export const fetchMaterialList = async (fromDate: Date, toDate: Date) => {
  const params = {
    FromDate: format(fromDate, 'dd/MM/yyyy'),
    ToDate: format(toDate, 'dd/MM/yyyy'),
  };
  
  const response = await axios.get(`${BASE_URL}/productionappservices/getmateriallist`, { params });
  return response.data;
};

export const fetchOperationList = async (fromDate: Date, toDate: Date, materialCode: string) => {
  const params = {
    FromDate: format(fromDate, 'dd/MM/yyyy'),
    ToDate: format(toDate, 'dd/MM/yyyy'),
    MaterialCode: materialCode,
  };
  
  const response = await axios.get(`${BASE_URL}/productionappservices/getoperationlist`, { params });
  return response.data;
};

export const fetchGuageList = async (fromDate: Date, toDate: Date, materialCode: string, operationCode: string) => {
  const params = {
    FromDate: format(fromDate, 'dd/MM/yyyy'),
    ToDate: format(toDate, 'dd/MM/yyyy'),
    MaterialCode: materialCode,
    OperationCode: operationCode,
  };
  
  const response = await axios.get(`${BASE_URL}/productionappservices/getguagelist`, { params });
  return response.data;
};

export const fetchInspectionData = async (
  fromDate: Date,
  toDate: Date,
  materialCode: string,
  operationCode: string,
  guageCode: string
) => {
  const params = {
    FromDate: format(fromDate, 'dd/MM/yyyy'),
    ToDate: format(toDate, 'dd/MM/yyyy'),
    MaterialCode: materialCode,
    OperationCode: operationCode,
    GuageCode: guageCode,
  };
  
  const response = await axios.get(`${BASE_URL}/productionappservices/getpirinspectiondatalist`, { params });
  return response.data;
};