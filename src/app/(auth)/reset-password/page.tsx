"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/components/supabase-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ResetFormValues) {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Error", {
          description:
            error.message || "Something went wrong. Please try again.",
        });
      } else {
        toast.error("Error", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="container max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent you a password reset link. Please check your
              email.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="mt-4">
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

