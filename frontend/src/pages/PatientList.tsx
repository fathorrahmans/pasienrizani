// src/components/PatientList.tsx
import React, { useState, useEffect } from "react";
import { Button, Divider, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import PatientFormModal from "../components/Patient/PatientFormModal";
import PatientTable from "../components/Patient/PatientTabel";
import { BASE_API } from "@/utils/secretKeys";

export interface Patient {
  id: number;
  name: string;
  rm: string;
  nik: string;
  alamat: string;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${BASE_API}/api/patient/`);
console.log(`${BASE_API}/api/patient/`)
      // Memeriksa jika status response tidak OK
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setPatients(data.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      // Kamu bisa menampilkan error ke pengguna jika diperlukan
      alert("Failed to fetch patients. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const onRefresh = () => {
    fetchPatients();
  };

  return (
    <Stack minH={"800px"}>
      <Text fontSize={"4xl"} fontWeight={"bold"}>
        Data Pasien
      </Text>
      <Divider />
      <VStack
        bg={"gray.100"}
        align={"start"}
        p={5}
        w={"100%"}
        borderRadius={"lg"}
      >
        <PatientFormModal onRefresh={onRefresh} />
        <Divider />
        <PatientTable patients={patients} onRefresh={onRefresh} />
      </VStack>
    </Stack>
  );
};

export default PatientList;
