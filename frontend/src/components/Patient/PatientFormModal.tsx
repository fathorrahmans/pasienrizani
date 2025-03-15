// src/components/PatientFormModal.tsx
import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useDisclosure,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { BASE_API } from "@/utils/secretKeys";

interface Patient {
  id: number;
  name: string;
  rm: string;
  nik: string;
  alamat: string;
}

interface PatientFormModalProps {
  onRefresh: () => void;
}

const PatientFormModal: React.FC<PatientFormModalProps> = ({ onRefresh }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState<Patient>({
    id: 0,
    name: "",
    rm: "",
    nik: "",
    alamat: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_API}/api/patient/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create patient. Please try again.");
      }

      const result = await response.json();

      // Refresh the patient list after successfully adding the patient
      onRefresh();

      // Reset the form data
      setFormData({ id: 0, name: "", rm: "", nik: "", alamat: "" });

      // Close the modal
      onClose();

      toast({
        title: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      // Catching errors from the fetch or other parts of the try block
      console.error("Error during submit:", error);

      // Optionally, you can display an error toast or message
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [nikError, setNikError] = useState<string | null>(null); // State for NIK error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "nik") {
      // Validate NIK length
      if (value.length !== 16) {
        setNikError("NIK must be 16 digits.");
      } else {
        setNikError(null); // Reset error when valid
      }
    }
  };

  const isDisabled =
    !formData.name || !formData.rm || !formData.nik || !formData.alamat;

  return (
    <>
      <Button colorScheme="teal" onClick={() => onOpen()}>
        + Tambah Pasien
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Pasien</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name" mb={4}>
              <FormLabel>Nama</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="rm" mb={4}>
              <FormLabel>RM</FormLabel>
              <Input
                type="text"
                name="rm"
                value={formData.rm}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="nik" mb={4} isInvalid={!!nikError}>
              <FormLabel>NIK</FormLabel>
              <Input
                type="text"
                name="nik"
                value={formData.nik}
                maxLength={16}
                onChange={handleChange}
              />
              {nikError && <FormErrorMessage>{nikError}</FormErrorMessage>}
            </FormControl>

            <FormControl id="alamat" mb={4}>
              <FormLabel>Alamat</FormLabel>
              <Input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleSubmit}
              isDisabled={isDisabled}
              width="130px"
            >
              {isLoading ? <Spinner size="sm" /> : "Tambahkan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PatientFormModal;
