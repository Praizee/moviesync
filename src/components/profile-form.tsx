"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name || "",
      avatar_url: initialData.avatar_url || "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);

    try {
      // Use the API route with admin privileges
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          avatar_url: values.avatar_url || "",
        }),
      });

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = `Server returned ${response.status}`;

        try {
          // Try to parse error details if available
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use the status text
          errorMessage = `${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      // Parse the successful response
      const data = await response.json();

      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Error", {
        description:
          error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={form.watch("avatar_url") || ""}
            alt={form.watch("name") || "User"}
          />
          <AvatarFallback className="text-2xl">
            {form.watch("name")?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">
            {form.watch("name") || "User"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your profile information
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter a URL for your profile picture.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

