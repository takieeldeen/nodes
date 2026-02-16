"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Icon } from "@iconify/react";

const registerSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords Don't Match",
        path: ["confirmPassword"],
      });
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      email: "",
      password: "",
      confirmPassword: "",
    }),
    [],
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.email,
        password: values.password,
        email: values.email,
        callbackURL: "/",
      },
      {
        onSuccess: () => router.push("/"),
        onError: (e) => {
          console.log(e);
          toast.error("Something Went wrong");
        },
      },
    );
  };

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                      disabled={isSubmitting}
                    >
                      <Icon icon="ri:github-fill" className="h-7! w-7!" />
                      Continue with GitHub
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                      disabled={isSubmitting}
                    >
                      <Icon
                        icon="material-icon-theme:google"
                        className="h-7! w-7!"
                      />
                      Continue with Google
                    </Button>
                    <div className="grid gap-6">
                      <FormField
                        control={control}
                        name="email"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="m@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={control}
                        name="password"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="************"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="************"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        Register{" "}
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="underline underline-offset-4"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
