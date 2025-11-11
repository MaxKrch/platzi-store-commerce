const getInitState = <K extends number | string, V>(fields: K[], init: V) => {
    type InitValue = Record<K, V>;

    const initState = fields.reduce((acc: InitValue, item: K) => {
        acc[item] = init;
        return acc;
    }, {} as InitValue);
    
    return initState;
};

export default getInitState;