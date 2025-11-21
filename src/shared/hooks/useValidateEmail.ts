import { useRootStore } from "@providers/RootStoreContext";
import { AuthSchema } from "@schemas/auth.schema";
import { useObserver } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import { AUTH_MODES, AuthModes } from "src/app/components/AuthModal/constants";

export type ValidateEmailArgs = {
    mode: AuthModes;
    email: string;
    trigger: (field: keyof AuthSchema) => Promise<boolean>;
}

const useValidateEmail = ({
    mode,
    email,
    trigger,
}: ValidateEmailArgs) => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortCtrl = useRef<AbortController | null>(null);
    const { authStore } = useRootStore();

    const clearTimer = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, []);

    const validateEmail = useCallback(
        async (value: AuthSchema["email"]) => {
            if (mode === AUTH_MODES.LOGIN || !value) {
                authStore.resetEmailAvailability();
                return;
            }

            if (abortCtrl.current) {
                abortCtrl.current.abort();
            }

            const controller = new AbortController();
            abortCtrl.current = controller;

            try {
                await authStore.checkEmailAvailability(value, {
                    signal: controller.signal,
                });
            } finally {
                if (abortCtrl.current === controller) {
                    abortCtrl.current = null;
                }
            }
        },
        [authStore, mode] 
    );

    useEffect(() => {
        clearTimer();

        if (mode !== AUTH_MODES.REGISTER || !email) {
            authStore.resetEmailAvailability();
            return;
        }

        timer.current = setTimeout(async () => {
            const isValid = await trigger("email");

            if (!isValid) {
                authStore.resetEmailAvailability();
                return;
            }

            validateEmail(email);
        }, 800);

        return clearTimer;
    }, [email, mode, clearTimer, validateEmail, trigger, authStore]);

    return useObserver(() => ({
        status: authStore.checkEmail.status,
        error: authStore.checkEmail.error,
        available: authStore.checkEmail.available
    }));
};

export default useValidateEmail;