// src/components/PatientTable.tsx
import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Patient } from "../../pages/PatientList";
import PatientUpdateForm from "./PatientUpdateForm";
import { BASE_API } from "@/utils/secretKeys";

interface PatientTableProps {
  patients: Patient[];
  onRefresh: () => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, onRefresh }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [selectedRemoveId, setSelectedRemoveId] = useState<number | null>(null);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);

  // Open update modal with patient data
  const handleUpdateClick = (id: number) => {
    setSelectedPatientId(id); // Set the selected patient ID to state
    onOpen(); // Open the modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedPatientId(null); // Clear the selected patient ID when modal is closed
    onClose(); // Close the modal
  };

  const handleRemoveClick = (id: number) => {
    setSelectedRemoveId(id); // Set the selected patient ID to state
    onDeleteOpen(); // Open the modal
  };
  const handleDelete = async (id: number) => {
    try {
      setIsLoadingRemove(true);
      // Mengirim permintaan DELETE ke API
      const response = await fetch(
        `${BASE_API}/api/patient/${id}`,
        {
          method: "DELETE",
        }
      );

      // Memeriksa apakah permintaan DELETE berhasil
      if (!response.ok) {
        throw new Error("Failed to delete patient.");
      }

      // Menyegarkan daftar pasien setelah berhasil dihapus
      onRefresh();
      onDeleteClose();

      // Menampilkan notifikasi sukses
      toast({
        title: "Success",
        description: "Patient deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error:", error);

      // Menampilkan notifikasi error jika gagal
      toast({
        title: "Error",
        description: "There was an issue deleting the patient.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoadingRemove(false);
    }
  };

  return (
    <>
      <Table variant="simple" overflowX="auto">
        <Thead>
          <Tr>
            <Th textAlign="center">Nama</Th>
            <Th textAlign="center" display={{ base: "none", sm: "table-cell" }}>
              RM
            </Th>
            <Th textAlign="center" display={{ base: "none", md: "table-cell" }}>
              NIK
            </Th>
            <Th textAlign="center" display={{ base: "none", md: "table-cell" }}>
              Alamat
            </Th>
            <Th textAlign="center">Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {patients.map((patient) => (
            <Tr key={patient.id}>
              <Td>{patient.name}</Td>
              <Td display={{ base: "none", sm: "table-cell" }}>{patient.rm}</Td>
              <Td display={{ base: "none", md: "table-cell" }}>
                {patient.nik}
              </Td>
              <Td display={{ base: "none", md: "table-cell" }}>
                {patient.alamat}
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  onClick={() => handleUpdateClick(patient.id)}
                  mx={2}
                  my={1}
                >
                  Edit
                </Button>
                <Button
                  mx={2}
                  my={1}
                  colorScheme="red"
                  onClick={() => handleRemoveClick(patient.id)}
                >
                  Hapus
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedPatientId && (
        <PatientUpdateForm
          onRefresh={onRefresh}
          patientId={selectedPatientId}
          onClose={handleCloseModal}
        />
      )}
      {isDeleteOpen && (
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Hapus Pasien</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Apakah anda yakin menghapus data ini?</ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
                Batal
              </Button>
              <Button
                isDisabled={selectedRemoveId === null}
                mx={3}
                colorScheme="red"
                onClick={() => {
                  if (selectedRemoveId !== null) {
                    handleDelete(selectedRemoveId);
                  }
                }}
                w={"60px"}
              >
                {isLoadingRemove ? <Spinner size="sm" /> : "Ya"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PatientTable;
