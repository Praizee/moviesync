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
import { useSupabase } from "@/components/supabase-provider";

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
  const { supabase } = useSupabase();
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
      // Update directly with Supabase client
      const { error } = await supabase.from("profiles").upsert({
        id: initialData.id,
        name: values.name,
        avatar_url: values.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      });
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
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

