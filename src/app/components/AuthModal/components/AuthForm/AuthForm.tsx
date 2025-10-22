import React, { memo, useCallback, useEffect } from "react";
import { schema, Schema } from "../../AuthModal.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import style from './AuthForm.module.scss';
import clsx from "clsx";
import Text from "@components/Text";
import Input from "@components/Input";
import CheckBox from "@components/CheckBox";
import Button from "@components/Button";
import { AUTH_MODES, AuthModes } from "../../constants";
import Loader from "@components/Loader";
import UserIcon from "@components/icons/UserIcon";
import MailIcon from "@components/icons/MailIcon";
import KeyIcon from "@components/icons/KeyIcon";

export type AuthFormProps = {
    onSubmit: (data: Schema) => void,
    mode: AuthModes, 
    needReset: boolean,
    error?: string | null,
    loading?: boolean
}

const AuthForm: React.FC<AuthFormProps> = ({ 
    onSubmit, 
    mode, 
    needReset, 
    error, 
    loading
}) => {
    const {
        register,
        control,
        formState: { errors, isValid, isDirty },
        handleSubmit,
        reset,
        resetField,
        clearErrors
    } = useForm<Schema>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    });

    const handleFocus = useCallback((field: keyof Schema) => {
        clearErrors(field);
    }, [clearErrors]);

    useEffect(() => {
        if (mode === AUTH_MODES.LOGIN) {
            resetField('email');
        }
    }, [mode, resetField]);

    useEffect(() => {
        if(needReset) {
            reset({
                login: '',
                email: '',
                password: '',
                saveMe: true,
            });
        }
    }, [needReset, reset]);

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={clsx(style['form'])}>
            <label className={clsx(style['form__label'])}>
                <UserIcon className={clsx(style['form__icon'])}/>
                <Input
                    onFocus={() => handleFocus('login')}
                    placeholder="Логин"
                    className={clsx(style['form__input'], errors.login && style['form__input_error'])}
                    {...register('login')}
                />
                <div className={clsx(style['form__error'])}>
                    {errors.login && errors.login.message}
                </div>
            </label>
            
            {mode === AUTH_MODES.REGISTER &&
                <label className={clsx(style['form__label'])}>
                    <MailIcon className={clsx(style['form__icon'])}/>
                    <Input 
                        onFocus={() => handleFocus('email')}
                        placeholder="Email"
                        className={clsx(style['form__input'], errors.email && style['form__input_error'])}
                        type='email'
                        {...register('email')}
                    />
                    <div className={clsx(style['form__error'])}>
                        {errors.email && errors.email.message}
                    </div>                        
                </label>
            }
            
            <label className={clsx(style['form__label'])}>
                <KeyIcon className={clsx(style['form__icon'])}/>
                <Input 
                    onFocus={() => handleFocus('password')}
                    placeholder="Пароль"
                    className={clsx(style['form__input'], errors.password && style['form__input_error'])}
                    type='password'
                    {...register('password')}
                />
                <div className={clsx(style['form__error'])}>
                    {errors.password && errors.password.message}
                </div>
            </label>
            
            <label className={clsx(style['form__checkbox'])}>
                <Text weight="bold" className={clsx(style['form__description'])}>
                    Запомнить меня:
                </Text>
                <Controller
                    name="saveMe"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <CheckBox
                            checked={field.value}
                            onChange={field.onChange}
                            ref={field.ref}
                            className={clsx(style['form__check'])}
                            checkSize='small'
                        />
                    )}
                />
            </label> 
            <div className={clsx(style['form__error'])}>
                {error}
            </div>
            <Button
                type='submit'
                className={clsx(style['form__submit-container'])} 
                disabled={!isValid || !isDirty}
                loading={loading}
                
            >
                {loading && <Loader size='s' className={clsx(style['form__submit-icon'])}/>}
                <div className={clsx(style['form__submit'])}>
                    {mode === AUTH_MODES.LOGIN ? 'Войти' : 'Зарегистрироваться'}
                </div>
            </Button>
        </form>
    );
};

export default memo(AuthForm);