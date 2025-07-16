import axios, { AxiosRequestConfig } from "axios";

export interface NativeNameLanguage {
  official: string;
  common: string;
}

export interface NativeName {
  [language: string]: NativeNameLanguage;
}

export interface CountryName {
  common: string;
  official: string;
  nativeName: NativeName;
}

export interface IDD {
  root: string;
  suffixes: string[];
}

export interface Country {
  name: CountryName;
  idd: IDD;
}

export type GetCountryDialingCodesResponse = Country[];

const getCountryDialingCodes = async (): Promise<GetCountryDialingCodesResponse> => {
  const config: AxiosRequestConfig = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://restcountries.com/v3.1/all?fields=name,idd",
    headers: {},
  };

  try {
    const response = await axios.request<GetCountryDialingCodesResponse>(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching country dialing codes:", error);
    throw error;
  }
};

export default getCountryDialingCodes;