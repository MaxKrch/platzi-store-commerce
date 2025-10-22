import style from './AuthHeader.module.scss';
import clsx from "clsx";
import { memo, useCallback } from "react";
import { AUTH_MODES, AuthModes } from "../../constants";


export type AuthHeaderProps = {
    mode: AuthModes,
    onChange: (mode: AuthModes) => void
}

const AuthHeader: React.FC<AuthHeaderProps> = ({mode, onChange}) => {
    const handleChangeMode = useCallback((newMode: AuthModes) => {
        if(mode !== newMode) {
            onChange(newMode);
        }
    }, [mode, onChange]);

    return( 
        <div className={clsx(style['header'])}>                    
            <div 
                onClick={() => handleChangeMode(AUTH_MODES.LOGIN)}
                className={clsx(
                    style['header__button'], 
                    mode === AUTH_MODES.LOGIN && style['header__button_active']
                )}
            >
                Вход
            </div>
            <div 
                onClick={() => handleChangeMode(AUTH_MODES.REGISTER)}
                className={clsx(
                    style['header__button'], 
                    mode === AUTH_MODES.REGISTER && style['header__button_active']
                )}
            >
                Регистрация
            </div>
        </div>  
    );
};

export default memo(AuthHeader);