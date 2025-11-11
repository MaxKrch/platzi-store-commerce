import z from "zod";

export const authSchema = z.object({
    login: z.string().min(3, 'Логин должен быть не менее 3 символов').optional(),
    email: z.email('Некорректный email'),
    password: z.string().min(3, 'Пароль должен быть не менее 5 символов')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d).{5,}$/, { message: 'Используйте только цифры и латинские буквы' }),
    saveMe: z.boolean()
});

export type AuthSchema = z.infer<typeof authSchema>

