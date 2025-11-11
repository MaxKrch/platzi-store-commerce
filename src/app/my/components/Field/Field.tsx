import { ChangeEvent, KeyboardEvent, useCallback, useEffect,  useRef, useState } from "react";
import style from './Field.module.scss';
import clsx from "clsx";
import Text from "@components/Text";
import Button from "@components/Button";
import OnlyClient from "@components/OnlyClient";
import Input from "@components/Input";
import { META_STATUS, MetaStatus } from "@constants/meta-status";
import Loader from "@components/Loader";


export type FieldProps = {
    title: string;
    onSave: (value: string) => Promise<{ success: boolean }>;
    validate?: (value: string) => Promise<{ success: boolean, aborted?: boolean }>;
    initValue?: string;
    type?: HTMLInputElement['type'];
    saving?: boolean;
    disabled?: boolean;
    error?: string | null;
    className?: string;
}

const Field: React.FC<FieldProps> = ({ 
    title, 
    onSave, 
    validate, 
    initValue = '',
    type = 'text',
    saving, 
    disabled, 
    error,
    className
}) => {
    const [localValue, setLocalValue] = useState(initValue);
    const [editing, setEditing] = useState(false);
    const [validated, setValidated] = useState<MetaStatus>(validate ? META_STATUS.IDLE : META_STATUS.SUCCESS);
    const valueRef = useRef<HTMLInputElement | null>(null);
    
    const handleEdit = useCallback(() => {
        setEditing(true);
        if(valueRef.current) {
            valueRef.current.focus();
        }
    }, []);

    const handleConfirm = useCallback(async () => {
        console.log(validated);
        if(initValue === localValue || validated !== META_STATUS.SUCCESS) {
            return;
        }

        const { success } = await onSave(localValue);
        if(success) {
            setEditing(false);
        }

    }, [initValue, localValue, validated, onSave]);

    const handleCancel = useCallback(() => {
        if(localValue !== initValue) {
            setLocalValue(initValue);
        }

        setEditing(false);
    }, [localValue, initValue]);

    const handleInput = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if(newValue !== localValue) {
            setLocalValue(newValue);
            
            if(validate) {
                setValidated(() => META_STATUS.PENDING);
                const result = await validate(newValue);
                console.log(result);
                if(result.success) {
                    setValidated(() => META_STATUS.SUCCESS);
                }

                if(!result.success && !result.aborted) {
                  setValidated(() => META_STATUS.ERROR);  
                }                
            }
        }
    }, [validate, localValue]);

    const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleConfirm();
        }

        if (event.key === 'Escape') {
            handleCancel();
        }
    }, [handleConfirm, handleCancel]);

    const handleBlur = useCallback(() => {
        if(localValue === initValue) {
            setEditing(false);
            valueRef.current?.blur();
        }
    }, [initValue, localValue]);

    useEffect(() => {
        if(localValue !== initValue) {
            setLocalValue(initValue);
        }
    }, [initValue, localValue]);
 
    return(
        <div className={clsx(style['field'], className)}>
            <Text className={clsx(style['field__title'])} weight='bold'>
                {title}:
            </Text>
            <Input
                ref={valueRef}
                className={clsx(style['field__value'])} 
                readOnly={!editing}
                onInput={handleInput}
                onKeyUp={handleKeyUp}
                value={localValue}
                onClick={handleEdit} 
                onBlur={handleBlur}
                type={type}       
            />
            <div className={clsx(style['field__buttons'])}>
                {editing 
                    ? (
                        <OnlyClient>
                            <Button 
                                className={clsx(style['field__button'])}
                                disabled={disabled || initValue === localValue || validated !== META_STATUS.SUCCESS} 
                                loading={saving}
                                onClick={handleConfirm}
                            >
                                {saving && <div className={clsx(style['field__icon-wrapper'])}>
                                    <Loader size='s' className={clsx(style['field__icon'])}/>
                                </div>}
                                Сохранить
                            </Button>
                            <Button
                                className={clsx(style['field__button'])}
                                priority="secondary"
                                disabled={disabled}
                                onClick={handleCancel}
                            >
                                Отменить
                            </Button>
                        </OnlyClient>
                    )
                    : (
                        <OnlyClient>
                            <Button 
                                className={clsx(style['field__button'])}
                                disabled={disabled}
                                onClick={handleEdit}
                            >
                                Редактировать
                            </Button>
                        </OnlyClient>
                    )
                }
            </div>
            <div  className={clsx(style['field__status'])}>
                {validated === META_STATUS.PENDING 
                    ? (
                        <div className={clsx(style['field__await'])}>
                            {'Секунду...'} 
                        </div>   
                    ) 
                    : (
                        <div className={clsx(style['field__error'])}>
                            {error}
                        </div>   
                    )
                }
      
            </div>
 
        </div>    
    );
};

export default Field;