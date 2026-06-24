"use client";
import { useLoginUserMutation } from "@/services/authApi";
import { error } from "console";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { email } from "zod";

type formData = {
    email: string;
    password: string;
};

export default function FormExampleComponent() {
    // calling login custom hook
    const [loginRequest, { data: loginResponse, error }] =
        useLoginUserMutation();
    // 1. delcare object using with useForm
    const { register, handleSubmit, reset, setError } = useForm({
        // 2. set default values
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 3. create handleSubmit to track value from input form
    const onSubmit = (data: formData) => {
        try {
            loginRequest({
                email: data?.email,
                password: data?.password,
            });
            console.log(error);

            if (data != null) {
                toast("You have login successfully!");
            }
        } catch (error) {
            toast.error("You need to login again!");
        }
        //  console.log("===> Form Data Email: ", data?.email);
        //  console.log("===> Form Data Password: ", data?.password);
    };
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* input email */}
                <label htmlFor="email">Email</label>
                <input
                    {...register("email")}
                    type="email"
                    name="email"
                    id="email"
                    className="border"
                />

                {/* password */}
                <label htmlFor="password">Password</label>
                <input
                    {...register("password")}
                    type="password"
                    name="password"
                    id="password"
                    className="border"
                />

                {/* submit */}
                <button type="submit" className="border">
                    Submit
                </button>
            </form>
        </div>
    );
}
