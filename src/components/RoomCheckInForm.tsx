import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
const formSchema = z.object({
  roomNumber: z.string().min(1, { message: "Le numéro de chambre est requis." }),
});
type RoomCheckInFormValues = z.infer<typeof formSchema>;
interface RoomCheckInFormProps {
  onSubmit: (values: RoomCheckInFormValues) => Promise<void>;
  isSubmitting: boolean;
}
export function RoomCheckInForm({ onSubmit, isSubmitting }: RoomCheckInFormProps) {
  const form = useForm<RoomCheckInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomNumber: "",
    },
  });
  const handleFormSubmit = async (values: RoomCheckInFormValues) => {
    await onSubmit(values);
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex items-end gap-4">
        <FormField
          control={form.control}
          name="roomNumber"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Numéro de chambre</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 101" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px] bg-accent hover:bg-accent/90 text-accent-foreground">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Valider"}
        </Button>
      </form>
    </Form>
  );
}