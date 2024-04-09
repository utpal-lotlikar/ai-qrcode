import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.string().url({ message: "Invalid URL specified" }),
  prompt: z
    .string()
    .min(1, { message: "Prompt must be atleast 2 characters" })
    .max(1000, { message: "Prompt should be less than 1000 characters" }),
});

type AiFormProps = {
  setImage: Dispatch<SetStateAction<string | null>>;
};

function AiForm({ setImage }: AiFormProps) {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    const payload = {
      url: values.url,
      prompt: values.prompt,
    };

    const url = process.env.NEXT_PUBLIC_QR_SERVICE_URL!;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Api response is ok");
        const data = await response.text();
        setImage(data);

        //send the prompt to webmaster
        try {
          await fetch("/api/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: `[AI QRCode]: New Request`,
              message: `URL: ${values.url}<br/>Prompt: ${values.prompt}`,
            }),
          });
        } catch (error) {
          console.error("Error:", error);
        }
        toast.success("QR Code Generated!");
      } else {
        toast.error("QR Code Generated Failed");
      }
    } catch (error) {
      toast.error("QR Code Generated Failed");
    }
    setPending(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="url">URL</FormLabel>
                <FormControl>
                  <Input
                    id="url"
                    placeholder="http://www.example.com"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="prompt">Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    id="prompt"
                    rows={5}
                    placeholder="Describe the image that you want to overlay on QR code"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  You can try &quot;a city view with clouds&quot;.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" className="gap-2" disabled={pending}>
              {pending ? (
                <Loader2
                  size={20}
                  className="animate-spin"
                  role="loader"
                  aria-label="Loading"
                />
              ) : (
                <Sparkles size={20} />
              )}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default AiForm;
