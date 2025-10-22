import React, { ChangeEvent, useCallback } from "react";
import Input, { InputProps } from "./Input";

type InputValueAdapterProps = Omit<InputProps, 'onChange' | 'value'> & {
    onChange: (value: string) => void,
    value: string,
}

const InputValueAdapter = React.forwardRef<HTMLInputElement, InputValueAdapterProps>(
    ({ onChange, value, ...rest }, ref) => {

        const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        }, [onChange]);

        return (
            <Input 
                {...rest} 
                ref={ref}
                value={value} 
                onChange={handleInputChange}
            />
        );
    }
);

InputValueAdapter.displayName = "InputValueAdapter";
export default InputValueAdapter;