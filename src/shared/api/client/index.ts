import AxiosClient from "./axios";
import FetchClient from "./fetch";

const Client = typeof window === 'undefined'
    ? FetchClient
    : AxiosClient;

export default Client;