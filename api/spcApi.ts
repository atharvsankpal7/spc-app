import axios from 'axios';
import { format } from 'date-fns';

const BASE_URL = 'http://10.10.1.7:8304/api';

const headers = {
  'Content-Type': 'application/json'
};

export const fetchShiftData = async () => {
  const response = await axios.get(`${BASE_URL}/commonappservices/getshiftdatalist`);
  return response.data;
};

export const fetchMaterialList = async (fromDate: Date, toDate: Date, shiftIds: number[]) => {
  const params = {
    FromDate: format(fromDate, 'dd/MM/yyyy'),
    ToDate: format(toDate, 'dd/MM/yyyy'),
  };
  
  const response = await axios.post(
    `${BASE_URL}/productionappservices/getmateriallist`, 
    shiftIds,
    { 
      params,
      headers 
    }
  );
  return response.data;
};

export const fetchOperationList = async (fromDate: Date, toDate: Date, materialCode: string, shiftIds: number[]) => {
  const params = {
    FromDate: format(fromDate, 'dd/MM/yyyy'),
    ToDate: format(toDate, 'dd/MM/yyyy'),
    MaterialCode: materialCode,
  };
  
  const response = await axios.post(
    `${BASE_URL}/productionappservices/getoperationlist`,
    shiftIds,
    { 
      params,
      headers 
    }
  );
  return response.data;
};

export const fetchGuageList = async (fromDate: Date, toDate: Date, materialCode: string, operationCode: string, shiftIds: number[]) => {
  const params = {
    FromDate: format(fromDate, 'dd/MM/yyyy'),
    ToDate: format(toDate, 'dd/MM/yyyy'),
    MaterialCode: materialCode,
    OperationCode: operationCode,
  };
  
  const response = await axios.post(
    `${BASE_URL}/productionappservices/getguagelist`,
    shiftIds,
    { 
      params,
      headers 
    }
  );
  return response.data;
};

export const fetchInspectionData = async (
  fromDate: Date,
  toDate: Date,
  materialCode: string,
  operationCode: string,
  guageCode: string,
  shiftIds: number[]
) => {
  const params = {
    FromDate: format(fromDate, 'dd/MM/yyyy'),
    ToDate: format(toDate, 'dd/MM/yyyy'),
    MaterialCode: materialCode,
    OperationCode: operationCode,
    GuageCode: guageCode,
  };
  
  const response = await axios.post(
    `${BASE_URL}/productionappservices/getpirinspectiondatalist`,
    shiftIds,
    { 
      params,
      headers 
    }
  );
  return response.data;
};