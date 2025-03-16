import { UseToastOptions } from "@chakra-ui/react";

export const showErrorToasts = (
  toast: (options: UseToastOptions) => void,
  errors: Record<string, string[]>
) => {
  Object.entries(errors).forEach(([_, messages]) => {
    messages.forEach((message) => {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    });
  });
};
