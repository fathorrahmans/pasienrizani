import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  CircularProgress,
  Stack,
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

const PatientUpdateForm = ({
  patientId,
  onClose,
  onRefresh,
}: {
  patientId: number;
  onClose: () => void;
  onRefresh: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Patient>({
    id: patientId,
    name: "",
    rm: "",
    nik: "",
    alamat: "",
  });
  const toast = useToast();

  // Fetch data pasien untuk update
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(
          `${BASE_API}/api/patient/${patientId}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setPatientData(data.data);
        setFormData(data.data); // Isi form dengan data pasien
      } catch (error) {
        toast({
          title: "Failed to fetch patient data",
          description: "Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    };
    fetchPatient();
  }, [patientId]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submit untuk update data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch(
        `${BASE_API}/api/patient/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update patient data");
      }

      const result = await response.json();
      onRefresh();
      toast({
        title: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      onClose(); // Close modal after update
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred while updating the patient.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const isDisabled =
    !formData.name || !formData.rm || !formData.nik || !formData.alamat;
  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Perbarui Data Pasien</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!patientData ? (
            <Stack h={"300px"} align={"center"} justify={"center"}>
              <CircularProgress isIndeterminate color="teal" />
            </Stack>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl id="name" mb={4}>
                <FormLabel>Nama</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl id="rm" mb={4}>
                <FormLabel>RM</FormLabel>
                <Input
                  type="text"
                  name="rm"
                  value={formData.rm}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl id="nik" mb={4}>
                <FormLabel>NIK</FormLabel>
                <Input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl id="alamat" mb={4}>
                <FormLabel>Alamat</FormLabel>
                <Input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                />
              </FormControl>

              <input type="hidden" name="id" value={formData.id} />

              <Button
                colorScheme="teal"
                type="submit"
                width="130px"
                isDisabled={isDisabled}
              >
                {isLoading ? <Spinner size="sm" /> : "Perbarui"}
              </Button>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PatientUpdateForm;
